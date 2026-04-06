# TestData to SALIENT Mapping Spec

## Goal

Convert raw session files from [`TestData`](../TestData) into the same feature space used by the SALIENT model trained on [`dataset/slide_window_data/size_30sec_150ts_stride_03ts`](../dataset/slide_window_data/size_30sec_150ts_stride_03ts).

The prediction-time output must match the model contract:

- 8 feature columns in this exact order:
  - `AB_I_O`
  - `AB_PHI_O`
  - `AB_I_DO`
  - `AB_PHI_DO`
  - `CD_I_O`
  - `CD_PHI_O`
  - `CD_I_DO`
  - `CD_PHI_DO`
- either:
  - a continuous CSV with just those 8 columns, which is windowed later, or
  - a chunked CSV with `chunk` + the 8 columns and exactly `150` rows per chunk
- no `label` column is required for inference

## What the Training Data Looks Like

Representative file: [`sub_1.csv`](../dataset/slide_window_data/size_30sec_150ts_stride_03ts/sub_1.csv)

Observed facts:

- The training CSVs are already preprocessed.
- Each chunk has exactly `150` rows.
- There are `8` derived channels plus `chunk` and `label`.
- Labels are `0`, `1`, `2`, `3`.
- The model was trained on values roughly in these ranges from a sample of `sub_1.csv`:

| Feature | Approx range |
|---|---|
| `AB_I_O` | `-0.495` to `0.425` |
| `AB_PHI_O` | `-0.524` to `1.128` |
| `AB_I_DO` | `-0.870` to `-0.103` |
| `AB_PHI_DO` | `-0.189` to `0.467` |
| `CD_I_O` | `-0.997` to `0.826` |
| `CD_PHI_O` | `-0.852` to `2.131` |
| `CD_I_DO` | `-0.909` to `0.313` |
| `CD_PHI_DO` | `-0.517` to `0.504` |

## What the Official Tufts Codebase Actually Does

Reference repo: [`fNIRS-mental-workload-classifiers`](../fNIRS-mental-workload-classifiers)

Important finding:

- The official Tufts training repo does **not** contain the raw `.nir` / `.oxy` to `slide_window_data` conversion pipeline.
- It assumes the classifier-ready `slide_window_data` folder already exists and reads `sub_<id>.csv` directly.

Evidence:

- [`README.md`](../fNIRS-mental-workload-classifiers/README.md) explicitly says to download the dataset and extract the `slide_window_data` folder into `data/slide_window_data`.
- [`DataLoader_Demo.ipynb`](../fNIRS-mental-workload-classifiers/DataLoader_Demo.ipynb) loads a file like `size_30sec_150ts_stride_3ts/sub_1.csv` directly.
- [`helpers/brain_data.py`](../fNIRS-mental-workload-classifiers/helpers/brain_data.py) only:
  - reads subject CSVs
  - selects the 8 feature columns
  - groups rows by `chunk`
  - returns tensors shaped like `(num_windows, 150, 8)`
- [`helpers/models.py`](../fNIRS-mental-workload-classifiers/helpers/models.py) deep models expect those raw window tensors directly.
- [`helpers/utils.py`](../fNIRS-mental-workload-classifiers/helpers/utils.py) classic models optionally summarize each `(150, 8)` window into 32 features:
  - per-channel mean
  - per-channel std
  - per-channel slope
  - per-channel intercept

Practical consequence:

- The Tufts repo can tell us exactly how classifier-ready window files are consumed.
- It does **not** tell us how to derive `AB_I_O ... CD_PHI_DO` from the raw COBI/fnirSoft exports in your `TestData`.
- So the missing step remains an **upstream preprocessing/export stage** that happened before the public `slide_window_data` release.

## What the Raw TestData Contains

Representative files:

- [`SUB_01_01_01141630.nir`](../TestData/Subject%2001/SUB_01_01_01141630.nir)
- [`SUB_01_01_01141630.oxy`](../TestData/Subject%2001/SUB_01_01_01141630.oxy)
- [`fS_Exported_lightgraph1.raw.Block1.csv`](../TestData/Subject%2001/First_light/fS_Exported_lightgraph1.raw.Block1.csv)
- [`fS_Exported_oxygraph1.hbo.Block1.csv`](../TestData/Subject%2001/First_oxy/fS_Exported_oxygraph1.hbo.Block1.csv)
- [`fS_Exported_oxygraph1.hbr.Block1.csv`](../TestData/Subject%2001/First_oxy/fS_Exported_oxygraph1.hbr.Block1.csv)
- [`fS_Exported_oxygraph1.oxy.Block1.csv`](../TestData/Subject%2001/First_oxy/fS_Exported_oxygraph1.oxy.Block1.csv)

Observed facts:

- Raw light export:
  - `3315 x 48`
  - `16` optodes
  - each optode has `730nm`, `Ambient`, `850nm`
  - sample cadence is about `0.51 s`
- Raw oxy exports:
  - `3315 x 16`
  - separate matrices for `hbo`, `hbr`, and `oxy`
  - columns are named `Optode1` ... `Optode16`
  - sample cadence is about `0.51 s`
- Session metadata confirms:
  - total optodes: `16`
  - total light channels: `48`
  - record time: about `1690 s`
- Marker data exists:
  - baseline marker appears at the beginning
  - repeated marker pairs suggest task blocks
  - end marker exists

Representative marker file: [`fS_Exported_oxygraph1.Marker1.csv`](../TestData/Subject%2001/First_oxy/fS_Exported_oxygraph1.Marker1.csv)

## What Is Known vs Unknown

### Known

- The model expects only `2` spatial groups: `AB` and `CD`.
- The raw test session currently exposes `16` optodes, not `AB` and `CD`.
- The raw oxy exports expose hemoglobin values (`hbo`, `hbr`, `oxy`), not the final AB/CD features directly.
- The raw light export exposes wavelength intensities (`730nm`, `850nm`, `ambient`) per optode.
- The raw exports do not contain columns literally named `AB_*` or `CD_*`.

### Unknown

- How `Optode1..16` map into the two aggregated training channels `AB` and `CD`.
- Whether `AB_I_*` and `CD_I_*` are direct aggregates of hemoglobin channels, optical intensity features, or another derived quantity.
- How the `PHI` channels were computed in the original Tufts preprocessing.
- Whether phase-like features can be reconstructed from the available exported files alone.
- Whether the original preprocessing used additional geometry, source-detector distance, or device-specific calibration values that are not present in this repo.

## Current Feasibility Status

### Directly feasible now

- Parsing raw `.nir`, `.oxy`, and fnirSoft block/time/marker files
- Time alignment of light and hemoglobin exports
- Baseline trimming using markers
- Resampling to a target cadence
- Windowing into `150`-row chunks with stride `3`
- Emitting final CSVs in the exact format the Tufts repo expects:
  - `8` feature columns
  - `chunk`
  - optional `label`

### Implemented experimentally in this repo

- `Optode1..8` are treated as the `AB` region
- `Optode9..16` are treated as the `CD` region
- `HbO` / `HbR` regional means drive the intensity-like oxy/deoxy features
- light-channel dynamics or subgroup differences drive phase-like proxies
- the continuous 8-feature signal is resampled to `5 Hz`
- the output is normalized and windowed into `150`-step chunks with stride `3`

Important:

- this makes the pipeline runnable end-to-end for your local `TestData`
- it is still an assumption-based approximation, not a verified copy of the original hidden Tufts preprocessing

## Required Mapping Table

The following table captures the implementation target and current evidence state:

| Target feature | Best current source candidate | Status |
|---|---|---|
| `AB_I_O` | aggregate of selected `hbo` optodes | unknown grouping |
| `AB_PHI_O` | phase/dual-slope feature derived from light channels | missing recipe |
| `AB_I_DO` | aggregate of selected `hbr` optodes | unknown grouping |
| `AB_PHI_DO` | phase/dual-slope feature derived from light channels | missing recipe |
| `CD_I_O` | aggregate of selected `hbo` optodes | unknown grouping |
| `CD_PHI_O` | phase/dual-slope feature derived from light channels | missing recipe |
| `CD_I_DO` | aggregate of selected `hbr` optodes | unknown grouping |
| `CD_PHI_DO` | phase/dual-slope feature derived from light channels | missing recipe |

## Recommended Preprocessing Pipeline

### Stage 1: Session Parsing

Inputs:

- `.nir`
- `.oxy`
- fnirSoft block exports (`hbo`, `hbr`, `oxy`, `raw`)
- time files
- marker files

Output:

- one aligned session table with:
  - `time`
  - `Optode1_HbO ... Optode16_HbO`
  - `Optode1_HbR ... Optode16_HbR`
  - `Optode1_730 ... Optode16_730`
  - `Optode1_850 ... Optode16_850`
  - `Optode1_Ambient ... Optode16_Ambient`
  - optional marker annotations

### Stage 2: Signal Cleanup

Operations:

- remove or mark baseline-only periods
- subtract ambient from raw light channels where appropriate
- fill missing values
- smooth obvious spikes if needed
- resample to the cadence expected by training

Note:

- The training folder name suggests `30 sec = 150 timesteps`, which implies `5 Hz`.
- The raw test exports appear closer to `~1.96 Hz` from `0.51 s` spacing.
- This means a resampling step is probably required before final windowing.

### Stage 3: Spatial Reduction to AB/CD

Goal:

- reduce `16` optodes into `2` channel groups: `AB` and `CD`

Blocked by:

- missing optode-to-AB/CD mapping

Possible evidence sources to look for:

- original Tufts preprocessing notebook or MATLAB script
- dataset paper supplementary material
- sensor layout / cap geometry documentation
- one sample processed subject with both optode-level and AB/CD-level representations

### Stage 4: Feature Derivation

Goal:

- derive the final 8 features:
  - intensity-like oxy/deoxy features
  - phase-like oxy/deoxy features

Blocked by:

- missing formula for `PHI`
- no local evidence that current raw exports alone are enough to reproduce the training features exactly

### Stage 5: Continuous Model-Ready CSV

Expected output:

- `time` optional
- the 8 model features in exact order

Suggested filename:

- `processed_testdata/<subject>/<session>_continuous_8ch.csv`

### Stage 6: Inference Windowing

Use the same contract as training:

- window size: `150`
- stride: `3`
- add `chunk`
- omit `label`

This matches the shape expected by the Tufts repo loaders:

- one subject CSV
- rows grouped by `chunk`
- each chunk matrix shaped `(150, 8)`

Suggested filename:

- `processed_testdata/<subject>/<session>_windows_150ts_stride3.csv`

## Stop/Go Criteria

### Go now

Proceed with implementation only for:

- parsing
- time alignment
- marker trimming
- resampling
- chunking

### Current repo strategy

The backend now ships both:

- a runnable experimental mapping for inference
- and the documentation of which assumptions that mapping is making

## Recommended Next Steps

1. Use the current experimental converter to preprocess raw sessions and test the full product flow.
2. Search for the upstream Tufts preprocessing recipe that creates `AB_I_*` and `CD_PHI_*`.
3. If that recipe is found, replace the current assumption-based AB/CD + `PHI` derivation with the verified one.
4. If that recipe is not available, consider a fallback project path:
   - retrain or fine-tune a model on the optode-level `hbo/hbr` representation instead of forcing this test data into the current AB/CD format.

## Practical Conclusion

The raw `TestData` is now runnable through an experimental converter in this repo.

The critical missing artifact is still the original transformation rule from:

- `16 optode light/hemoglobin exports`

to:

- `2 aggregated channels (AB, CD)`
- `intensity + phase`
- `oxy + deoxy`

Until that mapping is recovered, the current implementation strategy is:

- run inference with the explicit approximation already implemented
- keep those assumptions documented and easy to replace later
- avoid treating the current `PHI` proxies as scientifically equivalent to the original Tufts features
