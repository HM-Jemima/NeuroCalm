# NeuroCalm - Backend vs Notebook Gap Analysis

> Generated: 2026-03-20
> Updated: 2026-03-20 — ALL backend changes implemented

---

## Status: BACKEND FULLY ALIGNED WITH NOTEBOOKS

All backend code has been rewritten to match the notebook ML pipeline. The system operates in **two modes**:

- **Inference mode**: When `MODEL_PATH` + `SCALER_PATH` are configured, loads the trained Keras model and runs the real fNIRS pipeline
- **Simulation mode**: When no model is configured, generates plausible results for development/demo

---

## Changes Made

### 1. Config (`config.py` + `.env`) — DONE

New settings added:
```
MODEL_PATH          — Path to exported Keras model (.h5 or SavedModel dir)
MODEL_TYPE          — SALIENT | CNN_LSTM | Transformer
SCALER_PATH         — Path to exported StandardScaler (.pkl)
MODEL_METADATA_PATH — Path to model_metadata.json
WINDOW_SIZE         — 150 timesteps (30 sec at 5 Hz)
WINDOW_STRIDE       — 3 timesteps
N_CLASSES           — 4 (0-back, 1-back, 2-back, 3-back)
FNIRS_FEATURES      — AB_I_O,AB_PHI_O,AB_I_DO,AB_PHI_DO,CD_I_O,CD_PHI_O,CD_I_DO,CD_PHI_DO
```

### 2. Processor Rewrite (`eeg_processor.py`) — DONE

Complete rewrite. Now implements the full notebook pipeline:
1. **fNIRS data loading** — Reads CSV with 8 specific feature columns, MAT files, with column detection and fallback
2. **Sliding window** — Segments raw signal into `(N, 150, 8)` windows with configurable stride
3. **StandardScaler** — Flatten → scale → reshape (matches notebook preprocessing exactly)
4. **Keras inference** — Loads model with custom layer support (PosEnc, ChAttn, AttnPool for SALIENT)
5. **Window aggregation** — Averages predictions across all windows
6. **Stress score mapping** — `stress_score = sum(i * 33.3 * p_i)` from 4-class probabilities
7. **Band power derivation** — Maps workload class probabilities → delta/theta/alpha/beta/gamma for frontend compatibility
8. **Simulation fallback** — Generates plausible results when no model is loaded

### 3. Analysis Model (`models/analysis.py`) — DONE

New columns added:
- `workload_class` (Integer) — Predicted N-back class (0–3)
- `class_probabilities` (JSON) — Array of 4 softmax probabilities

### 4. Schema Update (`schemas/analysis.py`) — DONE

`AnalysisOut` now includes:
- `workload_class: int`
- `class_probabilities: list[float]`

### 5. Analysis Service + Router — DONE

- `run_analysis()` now stores `workload_class` and `class_probabilities`
- Router maps all new fields through to responses

### 6. Reports (`reports.py`) — DONE

Both PDF and JSON reports now include:
- **Cognitive Workload Classification** section with class label and probability bars
- **Class probability breakdown** (0-back through 3-back with colored bars in PDF)
- **Updated interpretation** text based on workload class (fNIRS language, not generic EEG)
- JSON report includes `workload_label`, `class_probabilities` as named dict

### 7. Admin Model Info (`admin_service.py`) — DONE

`get_model_info()` now:
- Reads from `MODEL_METADATA_PATH` JSON file if available
- Falls back to defaults matching the notebook models (Tufts fNIRS2MW, LOSO CV, 8 channels × 150 timesteps)

### 8. Dependencies (`requirements.txt`) — DONE

Added:
- `tensorflow-cpu==2.16.1` — Keras model inference
- `scikit-learn==1.5.2` — StandardScaler
- `joblib==1.4.2` — Scaler serialization
- `pandas==2.2.3` — CSV loading with column detection

### 9. Startup (`main.py`) — DONE

- `load_model()` called during app lifespan startup
- Loads Keras model + StandardScaler once, cached for all requests

### 10. Seed Data (`seed.py`) — DONE

Sample analyses now include `workload_class` and `class_probabilities` derived from stress scores.

---

## Remaining: Notebook Model Export (not a backend change)

The notebooks currently only save evaluation metrics (`.pkl` with accuracy/F1/kappa). To enable real inference, the following must be done **in the notebooks**:

1. After LOSO evaluation, retrain the best model on ALL subjects:
   ```python
   # After identifying the best model (e.g., SALIENT)
   sc = StandardScaler()
   X_all = sc.fit_transform(X.reshape(len(X), -1)).reshape(X.shape)

   model = build_salient((150, 8), 4, CONFIG)
   model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
   model.fit(X_all, y, epochs=30, batch_size=128, validation_split=0.1)
   ```

2. Export the model:
   ```python
   model.save('neurocalm_model.h5')
   ```

3. Export the scaler:
   ```python
   import joblib
   joblib.dump(sc, 'neurocalm_scaler.pkl')
   ```

4. Export metadata:
   ```python
   import json
   meta = {
       "model_type": "SALIENT",
       "version": "v1.0.0",
       "accuracy": f"{acc*100:.2f}%",
       "features": "1,200 (8 fNIRS channels x 150 timesteps)",
       "training_data": "Tufts fNIRS2MW — 10 subjects",
       "last_updated": "2026-03-20"
   }
   with open('model_metadata.json', 'w') as f:
       json.dump(meta, f, indent=2)
   ```

5. Configure in `.env`:
   ```
   MODEL_PATH=path/to/neurocalm_model.h5
   SCALER_PATH=path/to/neurocalm_scaler.pkl
   MODEL_METADATA_PATH=path/to/model_metadata.json
   ```
