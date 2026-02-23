import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, FileText, Clock, TrendingUp, Search, Bell, Download } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/common/Modal';
import Card from '../components/common/Card';
import StatsCard from '../components/dashboard/StatsCard';
import UploadZone from '../components/dashboard/UploadZone';
import AnalysisResult from '../components/dashboard/AnalysisResult';
import BandPowerChart from '../components/dashboard/BandPowerChart';
import HistoryTable from '../components/dashboard/HistoryTable';
import useAuthStore from '../store/authStore';
import { useAnalysis } from '../hooks/useAnalysis';
import { formatDate } from '../utils/helpers';

function getBandPowers(item) {
  if (item.band_powers) return item.band_powers;
  const s = item.stress_score ?? 50;
  return {
    delta: Math.min(45, Math.max(15, 35 - Math.round(s * 0.1))),
    theta: Math.min(35, Math.max(10, 22 + Math.round((s - 50) * 0.08))),
    alpha: Math.min(30, Math.max(8, 25 - Math.round(s * 0.15))),
    beta: Math.min(25, Math.max(5, 8 + Math.round(s * 0.12))),
    gamma: Math.min(15, Math.max(3, 5 + Math.round(s * 0.05))),
  };
}

function downloadJSON(item) {
  const data = {
    id: item.id,
    filename: item.filename || item.file_name,
    stress_score: item.stress_score ?? item.score,
    confidence: item.confidence,
    band_powers: getBandPowers(item),
    analyzed_by: item.user_name,
    created_at: item.created_at || item.date,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neurocalm_analysis_${item.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const quickStats = [
  { icon: FileText, label: 'Total Analyses', value: '24', change: '+12%', iconBg: 'bg-accent-blue/10', iconColor: 'text-accent-blue' },
  { icon: Activity, label: 'Avg Stress Score', value: '32', change: '-5%', iconBg: 'bg-accent-green/10', iconColor: 'text-accent-green' },
  { icon: Clock, label: 'Last Analysis', value: '2h ago', iconBg: 'bg-accent-purple/10', iconColor: 'text-accent-purple' },
  { icon: TrendingUp, label: 'Trend', value: 'Improving', change: '+8%', iconBg: 'bg-accent-cyan/10', iconColor: 'text-accent-cyan' },
];

const container = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    currentAnalysis,
    isAnalyzing,
    uploadProgress,
    history,
    uploadAndAnalyze,
    fetchHistory,
    deleteAnalysis,
  } = useAnalysis();
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    fetchHistory().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />

      <main className="ml-[260px] p-8">
        <motion.div
          variants={container}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">
                Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Here's an overview of your brain analysis activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 bg-bg-glass border border-border-color rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue w-48"
                />
              </div>
              <button className="relative w-10 h-10 rounded-xl border border-border-color flex items-center justify-center text-text-muted hover:text-text-primary hover:border-accent-blue/30 transition-all">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full" />
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <StatsCard key={stat.label} {...stat} />
            ))}
          </motion.div>

          {/* Upload + Quick Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-[1fr_400px] gap-6">
            <Card hover={false}>
              <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                Upload EEG File
              </h3>
              <UploadZone
                onAnalyze={uploadAndAnalyze}
                isAnalyzing={isAnalyzing}
                uploadProgress={uploadProgress}
              />
            </Card>

            <Card hover={false}>
              <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Relaxed Results', value: '18', total: '24', color: 'bg-accent-green' },
                  { label: 'Stressed Results', value: '4', total: '24', color: 'bg-accent-red' },
                  { label: 'Moderate Results', value: '2', total: '24', color: 'bg-accent-yellow' },
                  { label: 'Avg Confidence', value: '89%', total: '100', color: 'bg-accent-blue' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-text-secondary">{stat.label}</span>
                      <span className="text-sm font-semibold text-text-primary">{stat.value}</span>
                    </div>
                    <div className="h-2 bg-bg-glass rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} rounded-full transition-all`}
                        style={{ width: `${(parseInt(stat.value) / parseInt(stat.total)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Results Section */}
          {currentAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-6"
            >
              <Card hover={false}>
                <h3 className="text-lg font-semibold font-display text-text-primary mb-6">
                  Stress Analysis Result
                </h3>
                <AnalysisResult result={currentAnalysis} />
              </Card>

              <Card hover={false}>
                <h3 className="text-lg font-semibold font-display text-text-primary mb-6">
                  Band Power Analysis
                </h3>
                <BandPowerChart bandPowers={currentAnalysis.band_powers} />
              </Card>
            </motion.div>
          )}

          {/* History */}
          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <h3 className="text-lg font-semibold font-display text-text-primary mb-4">
                Recent Analyses
              </h3>
              <HistoryTable
                items={history}
                onView={(item) => setViewItem(item)}
                onDownload={(item) => downloadJSON(item)}
                onDelete={deleteAnalysis}
              />
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* View Modal */}
      <Modal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Analysis Details"
        wide
      >
        {viewItem && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-accent-blue" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {viewItem.filename || viewItem.file_name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatDate(viewItem.created_at || viewItem.date)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => downloadJSON(viewItem)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-color text-sm text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-all"
              >
                <Download size={14} />
                Export JSON
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">
                  Stress Analysis
                </h4>
                <AnalysisResult result={viewItem} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">
                  Band Power Breakdown
                </h4>
                <BandPowerChart bandPowers={getBandPowers(viewItem)} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
