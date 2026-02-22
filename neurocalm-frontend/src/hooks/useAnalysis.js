import { useState } from 'react';
import useAnalysisStore from '../store/analysisStore';

// Mock history data with user info
const MOCK_HISTORY = [
  { id: '1', filename: 'eeg_recording_001.mat', created_at: new Date().toISOString(), stress_score: 28, confidence: 92, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '2', filename: 'session_morning.edf', created_at: new Date(Date.now() - 3600000).toISOString(), stress_score: 65, confidence: 87, user_name: 'Emily Chen', user_email: 'emily@research.edu' },
  { id: '3', filename: 'baseline_test.csv', created_at: new Date(Date.now() - 86400000).toISOString(), stress_score: 42, confidence: 91, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '4', filename: 'post_meditation.mat', created_at: new Date(Date.now() - 172800000).toISOString(), stress_score: 15, confidence: 95, user_name: 'Dr. Michael Ross', user_email: 'mross@clinic.com' },
  { id: '5', filename: 'work_stress_sample.edf', created_at: new Date(Date.now() - 259200000).toISOString(), stress_score: 78, confidence: 88, user_name: 'Alex Kumar', user_email: 'alex.k@lab.org' },
  { id: '6', filename: 'relaxation_study.mat', created_at: new Date(Date.now() - 345600000).toISOString(), stress_score: 22, confidence: 94, user_name: 'Emily Chen', user_email: 'emily@research.edu' },
  { id: '7', filename: 'pre_exam_reading.csv', created_at: new Date(Date.now() - 432000000).toISOString(), stress_score: 71, confidence: 86, user_name: 'John Doe', user_email: 'user@neurocalm.com' },
  { id: '8', filename: 'sleep_onset_eeg.edf', created_at: new Date(Date.now() - 518400000).toISOString(), stress_score: 19, confidence: 93, user_name: 'Dr. Michael Ross', user_email: 'mross@clinic.com' },
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

  const [error, setError] = useState(null);

  const uploadAndAnalyze = async (file) => {
    try {
      setError(null);
      setAnalyzing(true);
      setProgress(0);

      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 200));
        setProgress(i);
      }

      await new Promise((r) => setTimeout(r, 800));

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
        user_name: 'John Doe',
        user_email: 'user@neurocalm.com',
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
    setHistory(MOCK_HISTORY);
    return MOCK_HISTORY;
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
