const stats = [
  { label: 'CPU Usage', value: 45, color: 'bg-accent-blue' },
  { label: 'Memory', value: 62, color: 'bg-accent-purple' },
  { label: 'Storage', value: 38, color: 'bg-accent-green' },
  { label: 'GPU', value: 71, color: 'bg-accent-yellow' },
];

export default function SystemStats() {
  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-text-secondary">{stat.label}</span>
            <span className="text-sm font-semibold text-text-primary">{stat.value}%</span>
          </div>
          <div className="h-2 bg-bg-glass rounded-full overflow-hidden">
            <div
              className={`h-full ${stat.color} rounded-full transition-all`}
              style={{ width: `${stat.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
