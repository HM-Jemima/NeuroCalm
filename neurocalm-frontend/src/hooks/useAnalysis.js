import { useState } from 'react';
import useAnalysisStore from '../store/analysisStore';
import useAuthStore from '../store/authStore';

// Helper to create dates relative to now
const ago = (ms) => new Date(Date.now() - ms).toISOString();
const HOUR = 3600000;
const DAY = 86400000;

// Mock history data with user info
const MOCK_HISTORY = [
  // --- Dr. Sarah Admin (admin@neurocalm.com) ---
  { id: '1',  filename: 'admin_review_batch_01.mat',   created_at: ago(HOUR * 2),   stress_score: 52, confidence: 93, user_name: 'Dr. Sarah Admin', user_email: 'admin@neurocalm.com' },
  { id: '2',  filename: 'clinical_trial_eeg_005.edf',  created_at: ago(DAY * 1),    stress_score: 38, confidence: 90, user_name: 'Dr. Sarah Admin', user_email: 'admin@neurocalm.com' },
  { id: '3',  filename: 'validation_set_alpha.mat',    created_at: ago(DAY * 3),    stress_score: 67, confidence: 88, user_name: 'Dr. Sarah Admin', user_email: 'admin@neurocalm.com' },
  { id: '4',  filename: 'model_benchmark_v2.csv',      created_at: ago(DAY * 5),    stress_score: 24, confidence: 96, user_name: 'Dr. Sarah Admin', user_email: 'admin@neurocalm.com' },
  { id: '5',  filename: 'patient_followup_009.edf',    created_at: ago(DAY * 8),    stress_score: 73, confidence: 91, user_name: 'Dr. Sarah Admin', user_email: 'admin@neurocalm.com' },
  { id: '6',  filename: 'research_pilot_cohort_a.mat', created_at: ago(DAY * 12),   stress_score: 31, confidence: 94, user_name: 'Dr. Sarah Admin', user_email: 'admin@neurocalm.com' },

  // --- John Doe (user@neurocalm.com) ---
  { id: '7',  filename: 'eeg_recording_001.mat',       created_at: ago(HOUR * 1),   stress_score: 28, confidence: 92, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '8',  filename: 'morning_session_feb22.edf',   created_at: ago(DAY * 1),    stress_score: 35, confidence: 89, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '9',  filename: 'baseline_test.csv',           created_at: ago(DAY * 2),    stress_score: 42, confidence: 91, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '10', filename: 'post_workout_scan.mat',       created_at: ago(DAY * 3),    stress_score: 19, confidence: 95, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '11', filename: 'pre_exam_reading.csv',        created_at: ago(DAY * 5),    stress_score: 71, confidence: 86, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '12', filename: 'evening_relaxation.edf',      created_at: ago(DAY * 7),    stress_score: 22, confidence: 93, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '13', filename: 'monday_commute_eeg.mat',      created_at: ago(DAY * 10),   stress_score: 58, confidence: 87, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '14', filename: 'sleep_study_night_03.edf',    created_at: ago(DAY * 14),   stress_score: 14, confidence: 94, user_name: 'John Doe', user_email: 'user@neurocalm.com' },

  // --- Emily Chen (emily@research.edu) ---
  { id: '15', filename: 'session_morning.edf',         created_at: ago(HOUR * 4),   stress_score: 65, confidence: 87, user_name: 'Emily Chen', user_email: 'emily@research.edu' },
  { id: '16', filename: 'relaxation_study.mat',        created_at: ago(DAY * 2),    stress_score: 22, confidence: 94, user_name: 'Emily Chen', user_email: 'emily@research.edu' },
  { id: '17', filename: 'focus_task_experiment.csv',    created_at: ago(DAY * 4),    stress_score: 48, confidence: 90, user_name: 'Emily Chen', user_email: 'emily@research.edu' },
  { id: '18', filename: 'meditation_pre_post.edf',     created_at: ago(DAY * 6),    stress_score: 17, confidence: 96, user_name: 'Emily Chen', user_email: 'emily@research.edu' },
  { id: '19', filename: 'study_group_control.mat',     created_at: ago(DAY * 9),    stress_score: 55, confidence: 88, user_name: 'Emily Chen', user_email: 'emily@research.edu' },

  // --- Dr. Michael Ross (mross@clinic.com) ---
  { id: '20', filename: 'post_meditation.mat',         created_at: ago(DAY * 1),    stress_score: 15, confidence: 95, user_name: 'Dr. Michael Ross', user_email: 'mross@clinic.com' },
  { id: '21', filename: 'patient_eeg_014.edf',         created_at: ago(DAY * 3),    stress_score: 82, confidence: 92, user_name: 'Dr. Michael Ross', user_email: 'mross@clinic.com' },
  { id: '22', filename: 'sleep_onset_eeg.edf',         created_at: ago(DAY * 6),    stress_score: 19, confidence: 93, user_name: 'Dr. Michael Ross', user_email: 'mross@clinic.com' },
  { id: '23', filename: 'clinical_assessment_021.mat',  created_at: ago(DAY * 10),   stress_score: 61, confidence: 89, user_name: 'Dr. Michael Ross', user_email: 'mross@clinic.com' },

  // --- Alex Kumar (alex.k@lab.org) ---
  { id: '24', filename: 'work_stress_sample.edf',      created_at: ago(DAY * 2),    stress_score: 78, confidence: 88, user_name: 'Alex Kumar', user_email: 'alex.k@lab.org' },
  { id: '25', filename: 'lab_recording_trial_07.csv',  created_at: ago(DAY * 5),    stress_score: 44, confidence: 91, user_name: 'Alex Kumar', user_email: 'alex.k@lab.org' },
  { id: '26', filename: 'baseline_resting_state.mat',  created_at: ago(DAY * 11),   stress_score: 30, confidence: 93, user_name: 'Alex Kumar', user_email: 'alex.k@lab.org' },
];

export function useAnalysis() {
  const {
    currentAnalysis,
    isAnalyzing,
    uploadProgress,
    history,
    setCurrentAnalysis,
    setAnalyzing,
    setProgress,
    setHistory,
    clearAnalysis,
  } = useAnalysisStore();

  const { user } = useAuthStore();
  const [error, setError] = useState(null);

  const uploadAndAnalyze = async (file) => {
    try {
      setError(null);
      setAnalyzing(true);
      setProgress(0);

      // Simulate realistic analysis pipeline with variable step durations
      const steps = [5, 12, 20, 30, 42, 55, 65, 78, 88, 95, 100];
      for (const pct of steps) {
        // Variable delay: slower in the middle (ML processing), faster at start/end
        const delay = pct > 40 && pct < 80 ? 400 + Math.random() * 300 : 200 + Math.random() * 200;
        await new Promise((r) => setTimeout(r, delay));
        setProgress(pct);
      }

      await new Promise((r) => setTimeout(r, 500));

      const score = Math.floor(Math.random() * 80) + 10;
      const result = {
        id: String(Date.now()),
        filename: file.name,
        stress_score: score,
        score,
        confidence: Math.floor(Math.random() * 15) + 82,
        stress_probability: score > 50 ? score : 100 - score,
        features_count: 1222,
        band_powers: {
          delta: Math.floor(Math.random() * 20) + 25,
          theta: Math.floor(Math.random() * 15) + 18,
          alpha: Math.floor(Math.random() * 15) + 15,
          beta: Math.floor(Math.random() * 10) + 8,
          gamma: Math.floor(Math.random() * 8) + 4,
        },
        created_at: new Date().toISOString(),
        user_name: user?.full_name || 'User',
        user_email: user?.email || '',
      };

      setCurrentAnalysis(result);
      setHistory([result, ...history]);
      return result;
    } catch (err) {
      setError('Analysis failed. Please try again.');
      throw err;
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchHistory = async () => {
    await new Promise((r) => setTimeout(r, 300));
    // Regular users only see their own analyses; admins see all
    const filtered = user?.role === 'admin'
      ? MOCK_HISTORY
      : MOCK_HISTORY.filter((item) => item.user_email === user?.email);
    setHistory(filtered);
    return filtered;
  };

  const deleteAnalysis = async (id) => {
    await new Promise((r) => setTimeout(r, 200));
    setHistory(history.filter((item) => item.id !== id));
  };

  return {
    currentAnalysis,
    isAnalyzing,
    uploadProgress,
    history,
    error,
    uploadAndAnalyze,
    fetchHistory,
    deleteAnalysis,
    clearAnalysis,
  };
}
