import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Brain, Zap, BarChart3, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import { isValidFile, formatFileSize } from '../../utils/helpers';

const analysisSteps = [
  { label: 'Uploading file...', icon: Upload, threshold: 10 },
  { label: 'Preprocessing EEG signal...', icon: Zap, threshold: 25 },
  { label: 'Removing artifacts & noise...', icon: Zap, threshold: 40 },
  { label: 'Extracting band power features...', icon: BarChart3, threshold: 55 },
  { label: 'Running ML classification model...', icon: Brain, threshold: 75 },
  { label: 'Generating stress report...', icon: FileText, threshold: 90 },
  { label: 'Analysis complete!', icon: CheckCircle, threshold: 100 },
];

function getCurrentStep(progress) {
  for (let i = analysisSteps.length - 1; i >= 0; i--) {
    if (progress >= analysisSteps[i].threshold) return analysisSteps[i];
  }
  return analysisSteps[0];
}

export default function UploadZone({ onAnalyze, isAnalyzing, uploadProgress }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Invalid file type. Please upload .mat, .edf, or .csv files.');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setError(null);
    } else if (file) {
      setError('Invalid file type. Please upload .mat, .edf, or .csv files.');
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentStep = getCurrentStep(uploadProgress);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          /* Analyzing State */
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-border-color rounded-2xl p-8"
          >
            {/* Animated brain icon */}
            <div className="flex flex-col items-center mb-6">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center mb-4"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Brain size={28} className="text-white" />
              </motion.div>
              <motion.p
                key={currentStep.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-text-primary"
              >
                {currentStep.label}
              </motion.p>
              <p className="text-xs text-text-muted mt-1">
                {selectedFile?.name}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary">Processing</span>
                <span className="text-xs text-accent-blue font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-bg-glass rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step indicators */}
            <div className="space-y-2">
              {analysisSteps.slice(0, -1).map((step) => {
                const done = uploadProgress >= step.threshold;
                const active = currentStep.label === step.label;
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done
                        ? 'bg-accent-green/10'
                        : active
                        ? 'bg-accent-blue/10'
                        : 'bg-bg-glass'
                    }`}>
                      {done ? (
                        <CheckCircle size={12} className="text-accent-green" />
                      ) : (
                        <step.icon size={10} className={active ? 'text-accent-blue' : 'text-text-muted'} />
                      )}
                    </div>
                    <span className={`text-xs ${
                      done
                        ? 'text-accent-green'
                        : active
                        ? 'text-text-primary font-medium'
                        : 'text-text-muted'
                    }`}>
                      {step.label}
                    </span>
                    {active && !done && (
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-accent-blue"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : !selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
              ${isDragOver
                ? 'border-accent-green bg-accent-green/10'
                : 'border-border-color hover:border-accent-blue hover:bg-accent-blue/5'
              }
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <Upload size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Drag & Drop your EEG file here
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  or click to browse from your computer
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                {['.mat', '.edf', '.csv'].map((ext) => (
                  <span
                    key={ext}
                    className="px-3 py-1.5 bg-bg-glass border border-border-color rounded-lg text-xs text-text-secondary font-medium"
                  >
                    {ext}
                  </span>
                ))}
              </div>
              <Button variant="primary" size="sm" onClick={(e) => e.stopPropagation()}>
                Browse Files
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-border-color rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                <FileText size={24} className="text-accent-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-text-muted">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center text-accent-red hover:bg-accent-red/20 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <Button
              variant="success"
              fullWidth
              onClick={() => onAnalyze(selectedFile)}
              disabled={isAnalyzing}
            >
              Analyze Stress Level
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-3 text-sm text-accent-red text-center">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".mat,.edf,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
