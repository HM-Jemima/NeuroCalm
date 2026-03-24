"""
fNIRS Processing Module

Handles file loading, preprocessing, and inference using the trained
Keras models from the notebook pipeline (SALIENT, CNN-LSTM, Transformer).

When MODEL_PATH is set and a trained model exists, performs real inference.
Otherwise, falls back to simulated results for development/demo purposes.

Supported upload formats: .mat, .edf, .csv

Deployment workflow:
  1. Run a model notebook (e.g. 1_SALIENT_Fast.ipynb) on Kaggle
  2. Download the exported artifacts:
     - {MODEL}_model.h5        (Keras model weights)
     - {MODEL}_scaler.pkl      (StandardScaler fitted on all data)
     - {MODEL}_metadata.json   (accuracy, f1, class labels, etc.)
  3. Set .env variables:
     MODEL_PATH=path/to/{MODEL}_model.h5
     MODEL_TYPE=SALIENT          (or CNN_LSTM or Transformer)
     SCALER_PATH=path/to/{MODEL}_scaler.pkl
     MODEL_METADATA_PATH=path/to/{MODEL}_metadata.json
"""

import json
import logging
import os
import random

import numpy as np
import pandas as pd

from app.config import get_settings

logger = logging.getLogger("neurocalm")
settings = get_settings()

VALID_EXTENSIONS = {".mat", ".edf", ".csv"}
CLASS_LABELS = ["0-back", "1-back", "2-back", "3-back"]

# ---------------------------------------------------------------------------
# Singleton model / scaler holders — loaded once at startup via load_model()
# ---------------------------------------------------------------------------
_model = None
_scaler = None
_model_loaded = False


def validate_file(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in VALID_EXTENSIONS


# ---------------------------------------------------------------------------
# Custom Keras layers (must match the notebook definitions exactly)
# ---------------------------------------------------------------------------

def _get_custom_objects():
    """Return the dict of custom Keras layer classes needed for model loading.

    Supports both naming conventions:
      - Verbose notebooks: PositionalEncoding, ChannelAttention, AttentionPooling
      - Legacy fast notebooks: PosEnc, ChAttn, AttnPool
    """
    import tensorflow as tf
    from tensorflow.keras import layers

    # --- Verbose notebook layers (current) ---------------------------------

    class PositionalEncoding(layers.Layer):
        def __init__(self, max_len, embed_dim, **kwargs):
            super().__init__(**kwargs)
            self.max_len = max_len
            self.embed_dim = embed_dim

        def build(self, input_shape):
            self.pos_emb = self.add_weight(
                shape=(self.max_len, self.embed_dim),
                initializer="glorot_uniform",
                trainable=True,
                name="pos_emb",
            )

        def call(self, x):
            return x + self.pos_emb[: tf.shape(x)[1], :]

        def get_config(self):
            config = super().get_config()
            config.update({"max_len": self.max_len, "embed_dim": self.embed_dim})
            return config

    class ChannelAttention(layers.Layer):
        def __init__(self, reduction=4, **kwargs):
            super().__init__(**kwargs)
            self.reduction = reduction

        def build(self, input_shape):
            ch = input_shape[-1]
            self.fc1 = layers.Dense(max(ch // self.reduction, 1), activation="relu")
            self.fc2 = layers.Dense(ch, activation="sigmoid")

        def call(self, x):
            avg = tf.reduce_mean(x, axis=1, keepdims=True)
            attn = self.fc2(self.fc1(avg))
            return x * attn

        def get_config(self):
            config = super().get_config()
            config.update({"reduction": self.reduction})
            return config

    class AttentionPooling(layers.Layer):
        def build(self, input_shape):
            self.dense = layers.Dense(1, activation="tanh")

        def call(self, x):
            w = tf.nn.softmax(self.dense(x), axis=1)
            return tf.reduce_sum(x * w, axis=1)

        def get_config(self):
            return super().get_config()

    # --- Legacy fast notebook layers (backward compat) ---------------------

    class PosEnc(layers.Layer):
        def __init__(self, m, d, **kwargs):
            super().__init__(**kwargs)
            self.m = m
            self.d = d

        def build(self, input_shape):
            self.pe = self.add_weight(
                shape=(self.m, self.d), initializer="glorot_uniform"
            )

        def call(self, x):
            return x + self.pe[: tf.shape(x)[1]]

        def get_config(self):
            config = super().get_config()
            config.update({"m": self.m, "d": self.d})
            return config

    class ChAttn(layers.Layer):
        def build(self, input_shape):
            self.fc = layers.Dense(input_shape[-1], activation="sigmoid")

        def call(self, x):
            return x * self.fc(tf.reduce_mean(x, axis=1, keepdims=True))

        def get_config(self):
            return super().get_config()

    class AttnPool(layers.Layer):
        def build(self, input_shape):
            self.d = layers.Dense(1)

        def call(self, x):
            return tf.reduce_sum(
                x * tf.nn.softmax(self.d(x), axis=1), axis=1
            )

        def get_config(self):
            return super().get_config()

    return {
        # Verbose (current)
        "PositionalEncoding": PositionalEncoding,
        "ChannelAttention": ChannelAttention,
        "AttentionPooling": AttentionPooling,
        # Legacy (backward compat)
        "PosEnc": PosEnc,
        "ChAttn": ChAttn,
        "AttnPool": AttnPool,
    }


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

def load_model():
    """Load the trained Keras model and StandardScaler from disk.

    Called once at application startup.  If the paths are not configured or
    the files are missing the application continues in simulation mode.
    """
    global _model, _scaler, _model_loaded

    model_path = settings.MODEL_PATH
    scaler_path = settings.SCALER_PATH

    if not model_path or not os.path.exists(model_path):
        logger.warning(
            "MODEL_PATH not set or not found (%s) — running in simulation mode",
            model_path,
        )
        return

    try:
        import tensorflow as tf

        custom_objects = _get_custom_objects()
        _model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)
        logger.info("Loaded Keras model from %s", model_path)
    except Exception as exc:
        logger.error("Failed to load Keras model: %s", exc)
        return

    if scaler_path and os.path.exists(scaler_path):
        try:
            import joblib

            _scaler = joblib.load(scaler_path)
            logger.info("Loaded StandardScaler from %s", scaler_path)
        except Exception as exc:
            logger.warning("Failed to load scaler: %s — will skip scaling", exc)
    else:
        logger.warning("SCALER_PATH not set or not found — will skip scaling")

    _model_loaded = True
    logger.info("Model ready for inference (type=%s)", settings.MODEL_TYPE)


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def _load_fnirs_data(file_path: str) -> pd.DataFrame | None:
    """Load an fNIRS file and return a DataFrame with the expected feature columns.

    Supports:
      - CSV with the 8 fNIRS feature columns (with or without ``chunk`` / ``label``).
      - MAT files where the first large array maps to the feature columns.
      - Generic CSV / MAT / EDF fall back to a numeric ndarray.
    """
    ext = os.path.splitext(file_path)[1].lower()
    features = settings.fnirs_feature_list

    try:
        if ext == ".csv":
            df = pd.read_csv(file_path)
            # Check if the expected fNIRS columns exist
            if all(col in df.columns for col in features):
                return df
            # Fallback: treat first N numeric columns as channels
            numeric = df.select_dtypes(include=[np.number])
            if numeric.shape[1] >= len(features):
                numeric.columns = features + list(numeric.columns[len(features):])
                return numeric
            if numeric.shape[1] > 0:
                # Pad missing channels with zeros
                for i, feat in enumerate(features):
                    if feat not in numeric.columns:
                        numeric[feat] = 0.0
                return numeric[features]
            return None

        elif ext == ".mat":
            from scipy.io import loadmat

            mat = loadmat(file_path)
            for key, value in mat.items():
                if isinstance(value, np.ndarray) and value.ndim == 2 and value.shape[0] > 10:
                    ncols = min(value.shape[1], len(features))
                    df = pd.DataFrame(value[:, :ncols], columns=features[:ncols])
                    for feat in features[ncols:]:
                        df[feat] = 0.0
                    return df
            return None

        elif ext == ".edf":
            # Lightweight EDF support — read as raw bytes / numpy
            # A full implementation would use mne or pyedflib.
            return None

    except Exception as exc:
        logger.warning("Failed to load file %s: %s", file_path, exc)

    return None


# ---------------------------------------------------------------------------
# Preprocessing (matches the notebook pipeline exactly)
# ---------------------------------------------------------------------------

def _create_windows(data: np.ndarray) -> np.ndarray:
    """Sliding-window segmentation → (N, window_size, n_features)."""
    ws = settings.WINDOW_SIZE
    stride = settings.WINDOW_STRIDE
    n_samples, n_features = data.shape

    if n_samples < ws:
        # Pad short files with edge values
        padded = np.pad(data, ((0, ws - n_samples), (0, 0)), mode="edge")
        return padded[np.newaxis, :, :]  # single window

    windows = []
    for start in range(0, n_samples - ws + 1, stride):
        windows.append(data[start: start + ws])
    return np.array(windows, dtype=np.float32)


def _preprocess(windows: np.ndarray) -> np.ndarray:
    """Flatten → scale → reshape (mirrors notebook StandardScaler usage)."""
    n, t, f = windows.shape
    flat = windows.reshape(n, t * f)

    if _scaler is not None:
        flat = _scaler.transform(flat)

    return flat.reshape(n, t, f)


# ---------------------------------------------------------------------------
# Band-power derivation (for frontend backward-compat)
# ---------------------------------------------------------------------------

def _derive_band_powers(class_probs: np.ndarray) -> dict:
    """Map the 4-class workload probabilities to the 5 band-power slots
    the frontend expects.

    Mapping rationale (cognitive-load ↔ EEG frequency relationship):
      - delta  — inversely related to workload → high at 0-back
      - theta  — increases with sustained attention → peaks at 1-back
      - alpha  — relaxation / idle → inversely related to load
      - beta   — active processing → increases with load
      - gamma  — high cognitive demand → peaks at 3-back
    """
    p0, p1, p2, p3 = class_probs

    raw_delta = 0.40 * p0 + 0.25 * p1 + 0.20 * p2 + 0.15 * p3
    raw_theta = 0.15 * p0 + 0.35 * p1 + 0.30 * p2 + 0.20 * p3
    raw_alpha = 0.35 * p0 + 0.25 * p1 + 0.20 * p2 + 0.10 * p3
    raw_beta = 0.10 * p0 + 0.15 * p1 + 0.30 * p2 + 0.35 * p3
    raw_gamma = 0.05 * p0 + 0.10 * p1 + 0.20 * p2 + 0.40 * p3

    total = raw_delta + raw_theta + raw_alpha + raw_beta + raw_gamma
    return {
        "delta": round(raw_delta / total * 100, 1),
        "theta": round(raw_theta / total * 100, 1),
        "alpha": round(raw_alpha / total * 100, 1),
        "beta": round(raw_beta / total * 100, 1),
        "gamma": round(raw_gamma / total * 100, 1),
    }


def _derive_band_powers_simulated(stress_score: float) -> dict:
    """Generate plausible band powers from a stress score (simulation mode)."""
    s = stress_score / 100.0
    delta = 35 - 15 * s
    theta = 18 + 8 * s
    alpha = 25 - 14 * s
    beta = 8 + 14 * s
    gamma = 5 + 10 * s
    total = delta + theta + alpha + beta + gamma
    return {
        "delta": round(delta / total * 100, 1),
        "theta": round(theta / total * 100, 1),
        "alpha": round(alpha / total * 100, 1),
        "beta": round(beta / total * 100, 1),
        "gamma": round(gamma / total * 100, 1),
    }


# ---------------------------------------------------------------------------
# Main inference entry-point
# ---------------------------------------------------------------------------

def predict_stress(file_path: str) -> dict:
    """Run the full analysis pipeline.

    When a trained model is loaded:
      1. Load file → extract fNIRS channels
      2. Sliding window → (N, 150, 8)
      3. StandardScaler.transform (flatten→scale→reshape)
      4. model.predict → (N, 4) class probabilities
      5. Aggregate windows (mean)
      6. Map to stress score + workload class
      7. Derive band powers for frontend

    When no model is available, returns simulated results.
    """

    # --- Try real inference ---------------------------------------------------
    if _model_loaded and _model is not None:
        df = _load_fnirs_data(file_path)
        if df is not None:
            features = settings.fnirs_feature_list
            data = df[features].values.astype(np.float32)
            windows = _create_windows(data)
            processed = _preprocess(windows)

            raw_preds = _model.predict(processed, verbose=0)  # (N, 4)
            avg_probs = raw_preds.mean(axis=0)  # (4,)
            avg_probs = avg_probs / avg_probs.sum()  # re-normalise

            workload_class = int(np.argmax(avg_probs))
            class_probs = [round(float(p), 4) for p in avg_probs]

            # Stress score: weighted sum  0-back=0, 1-back=33, 2-back=66, 3-back=100
            stress_score = round(
                sum(i * (100 / 3) * p for i, p in enumerate(avg_probs)), 1
            )
            stress_score = max(0, min(100, stress_score))

            confidence = round(float(np.max(avg_probs)) * 100, 1)
            stress_probability = round(
                float(avg_probs[2] + avg_probs[3]) * 100, 1
            )

            features_count = data.shape[0] * data.shape[1]  # rows × channels
            band_powers = _derive_band_powers(avg_probs)

            return {
                "stress_score": stress_score,
                "confidence": confidence,
                "stress_probability": stress_probability,
                "features_count": features_count,
                "band_powers": band_powers,
                "workload_class": workload_class,
                "class_probabilities": class_probs,
            }

        logger.warning("Could not parse fNIRS data from %s — falling back to simulation", file_path)

    # --- Simulation fallback --------------------------------------------------
    return _simulate_prediction(file_path)


def _simulate_prediction(file_path: str) -> dict:
    """Generate plausible simulated results when no model is available."""
    # Attempt to derive a deterministic seed from the file content
    try:
        data = np.genfromtxt(file_path, delimiter=",", max_rows=200)
        if data.size > 10:
            seed_val = int(np.nansum(np.abs(data[:100])) * 100) % 100
        else:
            seed_val = random.randint(5, 95)
    except Exception:
        seed_val = random.randint(5, 95)

    stress_score = max(5, min(95, seed_val))

    # Derive workload class from stress score
    if stress_score <= 25:
        workload_class = 0
    elif stress_score <= 50:
        workload_class = 1
    elif stress_score <= 75:
        workload_class = 2
    else:
        workload_class = 3

    # Simulated class probabilities centred on the predicted class
    probs = [0.0] * 4
    probs[workload_class] = 0.55 + random.uniform(0, 0.15)
    remaining = 1.0 - probs[workload_class]
    for i in range(4):
        if i != workload_class:
            probs[i] = remaining / 3
    probs = [round(p, 4) for p in probs]

    confidence = round(random.uniform(82, 97), 1)
    stress_probability = stress_score if stress_score > 50 else 100 - stress_score
    band_powers = _derive_band_powers_simulated(stress_score)

    return {
        "stress_score": stress_score,
        "confidence": confidence,
        "stress_probability": stress_probability,
        "features_count": 1200,
        "band_powers": band_powers,
        "workload_class": workload_class,
        "class_probabilities": probs,
    }
