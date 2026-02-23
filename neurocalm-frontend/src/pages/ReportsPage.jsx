import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Calendar, TrendingDown, TrendingUp,
  Brain, BarChart3, PieChart, ArrowRight, CheckCircle, AlertCircle,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import Modal from '../components/common/Modal';
import useAuthStore from '../store/authStore';

const MOCK_REPORTS = [
  // --- Dr. Sarah Admin ---
  {
    id: 'r1',
    title: 'Platform-Wide Weekly Overview',
    description: 'Aggregated stress metrics across all users for the past week including model performance notes',
    type: 'weekly',
    date: 'Feb 17 - Feb 23, 2026',
    analyses_count: 26,
    avg_score: 44,
    trend: 'down',
    status: 'ready',
    generated_by: 'Dr. Sarah Admin',
  },
  {
    id: 'r2',
    title: 'Clinical Trial Cohort B - Monthly',
    description: 'Monthly summary of clinical trial participants with band power trends and outlier flags',
    type: 'monthly',
    date: 'Jan 1 - Jan 31, 2026',
    analyses_count: 34,
    avg_score: 39,
    trend: 'down',
    status: 'ready',
    generated_by: 'Dr. Sarah Admin',
  },
  {
    id: 'r3',
    title: 'Model Validation Report v2.1',
    description: 'Cross-validation results and accuracy benchmarks for the latest Random Forest model release',
    type: 'research',
    date: 'Feb 10 - Feb 20, 2026',
    analyses_count: 50,
    avg_score: 47,
    trend: 'down',
    status: 'ready',
    generated_by: 'Dr. Sarah Admin',
  },
  {
    id: 'r4',
    title: 'Patient Follow-Up Assessment',
    description: 'Longitudinal EEG review of patient #009 showing stress trajectory over 8 sessions',
    type: 'clinical',
    date: 'Feb 1 - Feb 15, 2026',
    analyses_count: 8,
    avg_score: 51,
    trend: 'up',
    status: 'ready',
    generated_by: 'Dr. Sarah Admin',
  },

  // --- John Doe ---
  {
    id: 'r5',
    title: 'Weekly Stress Summary',
    description: 'Aggregated analysis of 6 EEG sessions from this week showing an overall relaxation trend',
    type: 'weekly',
    date: 'Feb 17 - Feb 23, 2026',
    analyses_count: 6,
    avg_score: 34,
    trend: 'down',
    status: 'ready',
    generated_by: 'John Doe',
  },
  {
    id: 'r6',
    title: 'Monthly Report - January 2026',
    description: 'Full month analysis with stress trends, band power averages, and personal recommendations',
    type: 'monthly',
    date: 'Jan 1 - Jan 31, 2026',
    analyses_count: 12,
    avg_score: 38,
    trend: 'down',
    status: 'ready',
    generated_by: 'John Doe',
  },
  {
    id: 'r7',
    title: 'Pre vs Post Meditation Comparison',
    description: 'Comparative analysis showing stress reduction after guided meditation sessions',
    type: 'comparison',
    date: 'Feb 8 - Feb 14, 2026',
    analyses_count: 4,
    avg_score: 28,
    trend: 'down',
    status: 'ready',
    generated_by: 'John Doe',
  },
  {
    id: 'r8',
    title: 'Sleep Quality EEG Report',
    description: 'Analysis of pre-sleep and during-sleep EEG recordings with delta wave breakdown',
    type: 'clinical',
    date: 'Feb 12, 2026',
    analyses_count: 3,
    avg_score: 18,
    trend: 'down',
    status: 'ready',
    generated_by: 'John Doe',
  },
  {
    id: 'r9',
    title: 'Workday Stress Patterns',
    description: 'Comparison of morning, midday, and evening recordings during a typical work week',
    type: 'comparison',
    date: 'Feb 3 - Feb 7, 2026',
    analyses_count: 9,
    avg_score: 52,
    trend: 'up',
    status: 'ready',
    generated_by: 'John Doe',
  },

  // --- Emily Chen ---
  {
    id: 'r10',
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
    id: 'r11',
    title: 'Focus Task Experiment Results',
    description: 'EEG analysis during cognitive load tasks — theta and beta band comparison across trials',
    type: 'research',
    date: 'Feb 5 - Feb 18, 2026',
    analyses_count: 10,
    avg_score: 46,
    trend: 'down',
    status: 'ready',
    generated_by: 'Emily Chen',
  },

  // --- Dr. Michael Ross ---
  {
    id: 'r12',
    title: 'Clinical Assessment - Patient Group',
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
    id: 'r13',
    title: 'Weekly Patient Monitoring',
    description: 'Ongoing weekly stress tracking for active patients with session-over-session comparison',
    type: 'weekly',
    date: 'Feb 17 - Feb 23, 2026',
    analyses_count: 7,
    avg_score: 45,
    trend: 'up',
    status: 'ready',
    generated_by: 'Dr. Michael Ross',
  },

  // --- Alex Kumar ---
  {
    id: 'r14',
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

function computeStats(reports) {
  const totalReports = reports.length;
  const totalSessions = reports.reduce((sum, r) => sum + r.analyses_count, 0);
  const avgScore = totalReports > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.avg_score, 0) / totalReports)
    : 0;
  const improving = reports.filter((r) => r.trend === 'down').length;
  const improvementPct = totalReports > 0
    ? Math.round((improving / totalReports) * 100)
    : 0;

  return [
    { label: 'Total Reports', value: String(totalReports), icon: FileText, color: 'bg-accent-blue/10 text-accent-blue' },
    { label: 'Avg Stress Score', value: String(avgScore), icon: Brain, color: 'bg-accent-green/10 text-accent-green' },
    { label: 'Total Sessions', value: String(totalSessions), icon: BarChart3, color: 'bg-accent-purple/10 text-accent-purple' },
    { label: 'Improving', value: `${improvementPct}%`, icon: TrendingDown, color: 'bg-accent-cyan/10 text-accent-cyan' },
  ];
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function downloadReport(report, format) {
  const data = {
    id: report.id,
    title: report.title,
    description: report.description,
    type: report.type,
    date: report.date,
    analyses_count: report.analyses_count,
    avg_score: report.avg_score,
    trend: report.trend,
    generated_by: report.generated_by,
  };

  if (format === 'json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurocalm_report_${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    // Mock PDF download — create a text summary as PDF-like
    const text = [
      `NEUROCALM REPORT`,
      `================`,
      ``,
      `Title: ${report.title}`,
      `Type: ${report.type}`,
      `Date: ${report.date}`,
      `Generated By: ${report.generated_by}`,
      ``,
      `Description:`,
      report.description,
      ``,
      `Analyses: ${report.analyses_count}`,
      `Average Stress Score: ${report.avg_score}`,
      `Trend: ${report.trend === 'down' ? 'Improving' : 'Increasing'}`,
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurocalm_report_${report.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export default function ReportsPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [viewReport, setViewReport] = useState(null);

  // Regular users only see their own reports; admins see all
  const userReports = user?.role === 'admin'
    ? MOCK_REPORTS
    : MOCK_REPORTS.filter((r) => r.generated_by === user?.full_name);

  const filteredReports = filter === 'all'
    ? userReports
    : userReports.filter((r) => r.type === filter);

  const summaryStats = computeStats(userReports);

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
                      <button
                        onClick={() => downloadReport(report, 'pdf')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-color text-sm text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-all"
                      >
                        <Download size={14} />
                        PDF
                      </button>
                      <button
                        onClick={() => downloadReport(report, 'json')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-color text-sm text-text-secondary hover:border-accent-green hover:text-accent-green transition-all"
                      >
                        <Download size={14} />
                        JSON
                      </button>
                      <button
                        onClick={() => setViewReport(report)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent-blue/10 text-sm text-accent-blue hover:bg-accent-blue/20 transition-all"
                      >
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

      {/* View Report Modal */}
      <Modal
        isOpen={!!viewReport}
        onClose={() => setViewReport(null)}
        title="Report Details"
        wide
      >
        {viewReport && (() => {
          const config = typeConfig[viewReport.type];
          const TrendIcon = viewReport.trend === 'down' ? TrendingDown : TrendingUp;
          const isImproving = viewReport.trend === 'down';

          return (
            <div className="space-y-6">
              {/* Report header */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                  <config.icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold font-display text-text-primary">{viewReport.title}</h3>
                    <Badge variant={viewReport.type === 'clinical' ? 'success' : 'default'} className="text-[10px] py-0.5">
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary">{viewReport.description}</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-bg-glass border border-border-color rounded-xl p-4 text-center">
                  <p className="text-2xl font-display font-bold text-text-primary">{viewReport.analyses_count}</p>
                  <p className="text-xs text-text-muted mt-1">Analyses</p>
                </div>
                <div className="bg-bg-glass border border-border-color rounded-xl p-4 text-center">
                  <p className="text-2xl font-display font-bold text-text-primary">{viewReport.avg_score}</p>
                  <p className="text-xs text-text-muted mt-1">Avg Score</p>
                </div>
                <div className="bg-bg-glass border border-border-color rounded-xl p-4 text-center">
                  <p className={`text-2xl font-display font-bold flex items-center justify-center gap-1 ${isImproving ? 'text-accent-green' : 'text-accent-red'}`}>
                    <TrendIcon size={18} />
                    {isImproving ? 'Down' : 'Up'}
                  </p>
                  <p className="text-xs text-text-muted mt-1">Trend</p>
                </div>
                <div className="bg-bg-glass border border-border-color rounded-xl p-4 text-center">
                  <p className="text-2xl font-display font-bold text-text-primary flex items-center justify-center gap-1">
                    {viewReport.avg_score <= 40 ? (
                      <CheckCircle size={18} className="text-accent-green" />
                    ) : (
                      <AlertCircle size={18} className="text-accent-red" />
                    )}
                    {viewReport.avg_score <= 40 ? 'Low' : viewReport.avg_score <= 65 ? 'Med' : 'High'}
                  </p>
                  <p className="text-xs text-text-muted mt-1">Stress Level</p>
                </div>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-6 text-sm text-text-secondary border-t border-border-color pt-4">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-text-muted" />
                  {viewReport.date}
                </span>
                <span className="flex items-center gap-2">
                  <Avatar name={viewReport.generated_by} size={20} className="rounded text-[9px]" />
                  {viewReport.generated_by}
                </span>
              </div>

              {/* Download actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => downloadReport(viewReport, 'pdf')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border-color text-sm text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-all"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  onClick={() => downloadReport(viewReport, 'json')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border-color text-sm text-text-secondary hover:border-accent-green hover:text-accent-green transition-all"
                >
                  <Download size={16} />
                  Download JSON
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
