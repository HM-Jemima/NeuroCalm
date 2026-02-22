import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/common/Card';
import HistoryTable from '../components/dashboard/HistoryTable';
import { useAnalysis } from '../hooks/useAnalysis';

export default function HistoryPage() {
  const { history, fetchHistory, deleteAnalysis } = useAnalysis();
  const [search, setSearch] = useState('');

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
              onDelete={deleteAnalysis}
            />
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
