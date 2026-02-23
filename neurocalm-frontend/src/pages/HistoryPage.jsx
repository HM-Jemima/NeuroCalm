import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import HistoryTable from '../components/dashboard/HistoryTable';
import AnalysisResult from '../components/dashboard/AnalysisResult';
import BandPowerChart from '../components/dashboard/BandPowerChart';
import { useAnalysis } from '../hooks/useAnalysis';
import { formatDate } from '../utils/helpers';

// Generate mock band powers for items that don't have them
function getBandPowers(item) {
  if (item.band_powers) return item.band_powers;
  // Derive deterministic but varied band powers from the stress score
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

export default function HistoryPage() {
  const { history, fetchHistory, deleteAnalysis } = useAnalysis();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchHistory().catch(() => {});
  }, []);

  const filteredHistory = history.filter((item) => {
    const name = item.filename || item.file_name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />

      <main className="ml-[260px] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary">
              Analysis History
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              View and manage your past EEG analyses
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-9 pr-4 py-2.5 bg-bg-glass border border-border-color rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-bg-glass border border-border-color rounded-xl text-sm text-text-secondary hover:border-accent-blue/30 transition-all">
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* Table */}
          <Card hover={false}>
            <HistoryTable
              items={filteredHistory}
              onView={(item) => setSelected(item)}
              onDownload={(item) => downloadJSON(item)}
              onDelete={deleteAnalysis}
            />
          </Card>
        </motion.div>
      </main>

      {/* View Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Analysis Details"
        wide
      >
        {selected && (
          <div className="space-y-6">
            {/* File info header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-accent-blue" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {selected.filename || selected.file_name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatDate(selected.created_at || selected.date)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => downloadJSON(selected)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-color text-sm text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-all"
              >
                <Download size={14} />
                Export JSON
              </button>
            </div>

            {/* Result + Band Power side by side */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">
                  Stress Analysis
                </h4>
                <AnalysisResult result={selected} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">
                  Band Power Breakdown
                </h4>
                <BandPowerChart bandPowers={getBandPowers(selected)} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
