import { motion } from 'framer-motion';
import { Brain, FileText, Zap, Shield, Clock } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/common/Card';
import UploadZone from '../components/dashboard/UploadZone';
import AnalysisResult from '../components/dashboard/AnalysisResult';
import BandPowerChart from '../components/dashboard/BandPowerChart';
import { useAnalysis } from '../hooks/useAnalysis';

const tips = [
  { icon: FileText, title: 'Supported Formats', desc: 'Upload .mat, .edf, or .csv EEG files for analysis.' },
  { icon: Zap, title: 'Fast Processing', desc: 'AI analysis completes in under 30 seconds.' },
  { icon: Shield, title: 'Secure Upload', desc: 'Your data is encrypted and processed securely.' },
  { icon: Clock, title: 'Auto-Saved', desc: 'All results are saved to your history automatically.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function NewAnalysisPage() {
  const {
    currentAnalysis,
    isAnalyzing,
    uploadProgress,
    uploadAndAnalyze,
    clearAnalysis,
  } = useAnalysis();

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />

      <main className="ml-[260px] p-8">
        <motion.div
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-display font-bold text-text-primary">
              New Analysis
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Upload an EEG recording to get instant AI-powered stress detection
            </p>
          </motion.div>

          {/* Upload + Tips */}
          <motion.div variants={fadeUp} className="grid grid-cols-[1fr_380px] gap-6">
            <Card hover={false}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold font-display text-text-primary">
                  Upload EEG File
                </h3>
                {currentAnalysis && (
                  <button
                    onClick={clearAnalysis}
                    className="text-sm text-accent-blue hover:underline"
                  >
                    New Upload
                  </button>
                )}
              </div>
              <UploadZone
                onAnalyze={uploadAndAnalyze}
                isAnalyzing={isAnalyzing}
                uploadProgress={uploadProgress}
              />
            </Card>

            <div className="space-y-4">
              {tips.map((tip) => (
                <Card key={tip.title} hover={false} className="!p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                      <tip.icon size={18} className="text-accent-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">{tip.title}</h4>
                      <p className="text-xs text-text-secondary mt-0.5">{tip.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          {currentAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-display font-bold text-text-primary">
                Analysis Results
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <Card hover={false}>
                  <h3 className="text-lg font-semibold font-display text-text-primary mb-6">
                    Stress Detection
                  </h3>
                  <AnalysisResult result={currentAnalysis} />
                </Card>

                <Card hover={false}>
                  <h3 className="text-lg font-semibold font-display text-text-primary mb-6">
                    Band Power Breakdown
                  </h3>
                  <BandPowerChart bandPowers={currentAnalysis.band_powers} />

                  <div className="mt-6 p-4 bg-bg-glass rounded-xl border border-border-color">
                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-medium">File Analyzed</p>
                    <p className="text-sm text-text-primary font-medium">{currentAnalysis.filename}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {currentAnalysis.features_count?.toLocaleString()} features extracted
                    </p>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
