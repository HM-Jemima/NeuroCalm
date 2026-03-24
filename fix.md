# NeuroCalm - Cross-Component Issues & Fixes

## Summary

After reviewing the **frontend**, **backend**, and **notebooks**, the three components are architecturally related and designed to work together. Several critical issues were found and fixed. Remaining items are listed below.

---

## FIXED Issues

### ~~2. Notebooks Don't Export Trained Models~~ FIXED

All 3 notebooks now include a **final deployment training step** after LOSO CV that:
- Trains a final model on ALL data (all subjects)
- Saves `{MODEL}_model.h5` (Keras model weights)
- Saves `{MODEL}_scaler.pkl` (StandardScaler fitted on all data via joblib)
- Saves `{MODEL}_metadata.json` (accuracy, f1, kappa, class labels, input shape)

### ~~3. Notebooks Don't Export the StandardScaler~~ FIXED

Each notebook now exports the scaler via `joblib.dump(sc_final, '{MODEL}_scaler.pkl')`.

### ~~13. LOSO CV Means No Single "Final" Model~~ FIXED

Each notebook now trains a final model on all 10 subjects' data after the LOSO evaluation loop.

### ~~11. Duplicate Notebook File~~ FIXED

Removed `2_CNN_LSTM_Fast (1).ipynb`.

### ~~12. Backend Custom Layers Missing get_config()~~ FIXED

- Notebook SALIENT: Added `get_config()` to `PosEnc` (needed for `.h5` serialization).
- Backend `eeg_processor.py`: Added `get_config()` to `ChAttn` and `AttnPool` for completeness.

### ~~Backend Description Says "EEG"~~ FIXED

- `main.py`: Changed FastAPI description to "fNIRS Cognitive Workload Analysis Platform".
- `eeg_processor.py`: Updated module docstring to "fNIRS Processing Module" with deployment workflow docs.

### ~~6. Backend Admin Stats Hardcoded model_accuracy~~ FIXED

`admin_service.py`: `get_system_stats()` now reads accuracy from `get_model_info()` (which reads `MODEL_METADATA_PATH`) instead of hardcoded "95.3%".

### ~~9. No Deployment Pipeline Documented~~ FIXED

Added deployment workflow documentation in `eeg_processor.py` module docstring explaining the 3-step process: run notebook, download artifacts, set `.env` variables.

---

## Remaining Issues (not fixed — frontend or design decisions)

### 1. Frontend Uses Mock Data Instead of Real Backend API

**Location:** `neurocalm-frontend/src/hooks/useAuth.js`, `useAnalysis.js`, `useAdmin.js`

**Problem:** The frontend hooks use hardcoded mock data. The service files that call the real backend API exist but are never used. **(Skipped per user request — no mock data changes.)**

---

### 4. EEG vs fNIRS Terminology in Frontend

**Location:** Frontend UI (LandingPage, UploadZone, AnalysisResult, BandPowerChart, constants, etc.)

**Problem:** The frontend refers to "EEG signals" and "brain waves" but the actual data is fNIRS. This is a frontend-only issue. The backend PDF report (`reports.py`) already uses correct fNIRS terminology.

**Fix when ready:** Update frontend text and visualizations to reference fNIRS or replace band power charts with workload class probability bars.

---

### 5. Backend Derives Band Powers from Class Probabilities

**Location:** `neurocalm-backend/app/utils/eeg_processor.py` — `_derive_band_powers()`

**Problem:** Band powers (delta/theta/alpha/beta/gamma) are derived from workload class probabilities using a cognitive-load mapping heuristic, not from real spectral analysis. This is scientifically approximate but serves as a reasonable proxy for the frontend visualization.

**Note:** The mapping rationale is documented in the code (cognitive-load-to-frequency relationship). This is a design trade-off — true spectral analysis would require raw EEG data, which is not available in the fNIRS pipeline.

---

### 7. Stress Score Mapping is a Design Decision

**Location:** `neurocalm-backend/app/utils/eeg_processor.py`

**Note:** The mapping `0-back=0%, 1-back=33%, 2-back=66%, 3-back=100%` is a linear mapping from workload to stress. This is a reasonable simplification. The code already documents this inline.

---

### 8. Backend MODEL_PATH is Empty (Simulation Mode)

**Location:** `neurocalm-backend/.env`

**Status:** This is expected for development. Once notebooks export model artifacts, set:
```
MODEL_PATH=models/SALIENT_model.h5
MODEL_TYPE=SALIENT
SCALER_PATH=models/SALIENT_scaler.pkl
MODEL_METADATA_PATH=models/SALIENT_metadata.json
```

---

### 14. Upload Format Validation

**Problem:** Backend expects CSV files with specific fNIRS column names. Users uploading arbitrary CSVs will get errors.

**Fix when ready:** Add upload instructions in the frontend showing expected column format.

---

### 15. Database Migrations

Generate initial migration before first run:
```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

---

### 16. Default Secret Key

Replace `SECRET_KEY=change-this-to-a-random-secret-key-in-production` in `.env` before deployment.

---

## Notebook Outputs After Fix

Each model notebook now exports these artifacts to `/kaggle/working/`:

| File | Description |
|------|-------------|
| `{MODEL}_model.h5` | Keras model trained on all subjects |
| `{MODEL}_scaler.pkl` | StandardScaler fitted on all data |
| `{MODEL}_metadata.json` | Model info (accuracy, f1, kappa, class labels, input shape) |
| `{MODEL}_results.pkl` | LOSO CV evaluation results |
| `{MODEL}_plot.png` | Confusion matrix + per-subject accuracy chart |

Where `{MODEL}` is one of: `SALIENT`, `CNN_LSTM`, `Transformer`
