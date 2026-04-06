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
import useAuthStore from '../store/authStore';
import { formatDate } from '../utils/helpers';
import { getAnalysisBandPowers } from '../utils/analysisPresentation';

export default function HistoryPage() {
  const { user } = useAuthStore();
  const {
    history,
    fetchHistory,
    getAnalysisDetails,
    deleteAnalysis,
    downloadReportJson,
  } = useAnalysis();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchHistory().catch(() => {});
  }, [user?.email]);

  const handleView = async (item) => {
    setSelected(item);

    try {
      const details = await getAnalysisDetails(item.id);
      setSelected(details);
    } catch {
      // Keep the lightweight row data visible if the detail request fails.
    }
  };

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
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary">
              Analysis History
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              View and manage your past stress analyses
            </p>
          </div>

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

          <Card hover={false}>
            <HistoryTable
              items={filteredHistory}
              onView={handleView}
              onDownload={(item) => downloadReportJson(item.id, item)}
              onDelete={deleteAnalysis}
            />
          </Card>
        </motion.div>
      </main>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Analysis Details"
        wide
      >
        {selected && (
          <div className="space-y-6">
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
                onClick={() => downloadReportJson(selected.id, selected)}
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
                <AnalysisResult result={selected} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">
                  Band Power Breakdown
                </h4>
                <BandPowerChart bandPowers={getAnalysisBandPowers(selected)} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
