export const VALID_FILE_EXTENSIONS = ['.mat', '.edf', '.csv'];

export const STRESS_LEVELS = {
  RELAXED: { min: 0, max: 40, label: 'Relaxed', color: '#10b981' },
  MODERATE: { min: 41, max: 60, label: 'Moderate', color: '#f59e0b' },
  STRESSED: { min: 61, max: 100, label: 'Stressed', color: '#ef4444' },
};

export const BAND_COLORS = {
  delta: { color: '#6366f1', label: 'Delta', freq: '0.5-4 Hz' },
  theta: { color: '#8b5cf6', label: 'Theta', freq: '4-8 Hz' },
  alpha: { color: '#06b6d4', label: 'Alpha', freq: '8-13 Hz' },
  beta: { color: '#10b981', label: 'Beta', freq: '13-30 Hz' },
  gamma: { color: '#f59e0b', label: 'Gamma', freq: '30-100 Hz' },
};
