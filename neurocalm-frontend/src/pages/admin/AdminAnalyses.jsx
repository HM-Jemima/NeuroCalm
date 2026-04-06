import { motion } from 'framer-motion';
import {
  Search, Download,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useAuthStore from '../../store/authStore';
import useSidebarStore from '../../store/sidebarStore';
import { useAdmin } from '../../hooks/useAdmin';

const resultColors = {
  Stressed: 'text-accent-red bg-accent-red/10',
  Relaxed: 'text-accent-green bg-accent-green/10',
  Moderate: 'text-accent-yellow bg-accent-yellow/10',
};

export default function AdminAnalyses() {
  const { user } = useAuthStore();
  const isSidebarCollapsed = useSidebarStore((state) => state.isCollapsed);
  const { analyses, fetchAnalyses, loading, error } = useAdmin();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnalyses().catch(() => {});
  }, [user?.id]);

  const filtered = analyses.filter((analysis) => {
    const matchesSearch = analysis.user.toLowerCase().includes(search.toLowerCase())
      || analysis.file.toLowerCase().includes(search.toLowerCase())
      || analysis.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || analysis.result.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <AdminSidebar />

      <main className={`p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-[92px]' : 'ml-[260px]'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">Analyses</h1>
              <p className="text-sm text-text-secondary mt-1">
                View and manage all analyses across the platform
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => fetchAnalyses().catch(() => {})}>
              <Download size={16} className="mr-2 inline" />
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user, file, or ID..."
                className="w-full pl-9 pr-4 py-2.5 bg-bg-glass border border-border-color rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'stressed', 'relaxed', 'moderate'].map((value) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors
                    ${filter === value
                      ? 'bg-accent-blue/10 text-accent-blue'
                      : 'text-text-muted hover:text-text-secondary'
                    }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-accent-red">{error}</p>
          )}

          <Card hover={false}>
            {loading && analyses.length === 0 ? (
              <div className="py-10 text-center text-sm text-text-secondary">
                Loading analyses...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-color">
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">ID</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">User</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">File</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Result</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Confidence</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((analysis) => (
                      <tr key={analysis.id} className="border-b border-border-color/50 hover:bg-bg-glass/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-text-muted font-mono">{analysis.id}</td>
                        <td className="py-3 px-4 text-sm text-text-primary">{analysis.user}</td>
                        <td className="py-3 px-4 text-sm text-text-secondary font-mono text-xs">{analysis.file}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${resultColors[analysis.result] || 'text-text-secondary bg-bg-glass'}`}>
                            {analysis.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-secondary">{analysis.confidence}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{analysis.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
