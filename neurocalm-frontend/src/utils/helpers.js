import { VALID_FILE_EXTENSIONS, STRESS_LEVELS } from './constants';

export function isValidFile(file) {
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  return VALID_FILE_EXTENSIONS.includes(extension);
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getStressLevel(score) {
  if (score <= STRESS_LEVELS.RELAXED.max) return STRESS_LEVELS.RELAXED;
  if (score <= STRESS_LEVELS.MODERATE.max) return STRESS_LEVELS.MODERATE;
  return STRESS_LEVELS.STRESSED;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
