import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Calendar, TrendingDown, TrendingUp,
  Brain, BarChart3, PieChart, ArrowRight,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';

const MOCK_REPORTS = [
  {
    id: 'r1',
    title: 'Weekly Stress Summary',
    description: 'Aggregated analysis of 6 EEG sessions from this week',
    type: 'weekly',
    date: 'Feb 10 - Feb 16, 2026',
    analyses_count: 6,
    avg_score: 34,
    trend: 'down',
    status: 'ready',
    generated_by: 'John Doe',
  },
  {
    id: 'r2',
    title: 'Monthly Report - January 2026',
    description: 'Full month analysis with stress trends, band power averages, and recommendations',
    type: 'monthly',
    date: 'Jan 1 - Jan 31, 2026',
    analyses_count: 18,
    avg_score: 41,
    trend: 'up',
    status: 'ready',
    generated_by: 'Emily Chen',
  },
  {
    id: 'r3',
    title: 'Clinical Assessment - Dr. Ross',
    description: 'Detailed clinical-grade EEG report with band power analysis and diagnostic notes',
    type: 'clinical',
    date: 'Feb 12, 2026',
    analyses_count: 3,
    avg_score: 22,
    trend: 'down',
    status: 'ready',
    generated_by: 'Dr. Michael Ross',
  },
  {
    id: 'r4',
    title: 'Pre vs Post Meditation Comparison',
    description: 'Comparative analysis showing stress reduction after meditation sessions',
    type: 'comparison',
    date: 'Feb 8 - Feb 14, 2026',
    analyses_count: 4,
    avg_score: 28,
    trend: 'down',
    status: 'ready',
    generated_by: 'John Doe',
  },
  {
    id: 'r5',
    title: 'Research Export - Study Group A',
    description: 'Batch export of EEG analysis data for academic research purposes',
    type: 'research',
    date: 'Feb 1 - Feb 15, 2026',
    analyses_count: 12,
    avg_score: 55,
    trend: 'up',
    status: 'ready',
    generated_by: 'Alex Kumar',
  },
];

const typeConfig = {
  weekly: { color: 'bg-accent-blue/10 text-accent-blue', icon: Calendar, label: 'Weekly' },
  monthly: { color: 'bg-accent-purple/10 text-accent-purple', icon: BarChart3, label: 'Monthly' },
  clinical: { color: 'bg-accent-green/10 text-accent-green', icon: Brain, label: 'Clinical' },
  comparison: { color: 'bg-accent-cyan/10 text-accent-cyan', icon: PieChart, label: 'Comparison' },
  research: { color: 'bg-accent-yellow/10 text-accent-yellow', icon: FileText, label: 'Research' },
};

const summaryStats = [
  { label: 'Total Reports', value: '23', icon: FileText, color: 'bg-accent-blue/10 text-accent-blue' },
  { label: 'Avg Stress Score', value: '36', icon: Brain, color: 'bg-accent-green/10 text-accent-green' },
  { label: 'Total Sessions', value: '43', icon: BarChart3, color: 'bg-accent-purple/10 text-accent-purple' },
  { label: 'Improvement', value: '+18%', icon: TrendingDown, color: 'bg-accent-cyan/10 text-accent-cyan' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ReportsPage() {
  const [filter, setFilter] = useState('all');

  const filteredReports = filter === 'all'
    ? MOCK_REPORTS
    : MOCK_REPORTS.filter((r) => r.type === filter);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />

      <main className="ml-[260px] p-8">
        <motion.div
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">Reports</h1>
              <p className="text-sm text-text-secondary mt-1">
                Generated summaries and exportable analysis reports
              </p>
            </div>
            <Button size="sm">
              <Download size={16} className="mr-2 inline" />
              Export All
            </Button>
          </motion.div>

          {/* Summary Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
            {summaryStats.map((stat) => (
              <Card key={stat.label} hover={false} className="!p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xl font-display font-bold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-secondary">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeUp} className="flex gap-2">
            {[
              { id: 'all', label: 'All Reports' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'clinical', label: 'Clinical' },
              { id: 'comparison', label: 'Comparison' },
              { id: 'research', label: 'Research' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${filter === tab.id
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:bg-bg-glass hover:text-text-primary'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Report Cards */}
          <motion.div variants={fadeUp} className="space-y-4">
            {filteredReports.map((report) => {
              const config = typeConfig[report.type];
              const TrendIcon = report.trend === 'down' ? TrendingDown : TrendingUp;
              const isImproving = report.trend === 'down';

              return (
                <Card key={report.id} className="!p-5">
                  <div className="flex items-start gap-5">
                    {/* Type Icon */}
                    <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                      <config.icon size={22} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-semibold text-text-primary">{report.title}</h3>
                        <Badge variant={report.type === 'clinical' ? 'success' : 'default'} className="text-[10px] py-0.5">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{report.description}</p>

                      <div className="flex items-center gap-6 text-xs text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {report.date}
                        </span>
                        <span>{report.analyses_count} analyses</span>
                        <span className="flex items-center gap-1.5">
                          <Avatar name={report.generated_by} size={18} className="rounded text-[8px]" />
                          {report.generated_by}
                        </span>
                        <span className={`flex items-center gap-1 font-semibold ${isImproving ? 'text-accent-green' : 'text-accent-red'}`}>
                          <TrendIcon size={12} />
                          Avg: {report.avg_score}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-color text-sm text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-all">
                        <Download size={14} />
                        PDF
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-color text-sm text-text-secondary hover:border-accent-green hover:text-accent-green transition-all">
                        <Download size={14} />
                        JSON
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent-blue/10 text-sm text-accent-blue hover:bg-accent-blue/20 transition-all">
                        View
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
