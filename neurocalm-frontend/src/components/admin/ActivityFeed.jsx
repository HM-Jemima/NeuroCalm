import { Upload, UserPlus, FileCheck, AlertTriangle } from 'lucide-react';

const activities = [
  { icon: Upload, text: 'New file uploaded by John D.', time: '2m ago', color: 'bg-accent-blue/10 text-accent-blue' },
  { icon: UserPlus, text: 'New user registered', time: '15m ago', color: 'bg-accent-green/10 text-accent-green' },
  { icon: FileCheck, text: 'Analysis completed #1847', time: '23m ago', color: 'bg-accent-purple/10 text-accent-purple' },
  { icon: AlertTriangle, text: 'High stress detected', time: '1h ago', color: 'bg-accent-yellow/10 text-accent-yellow' },
  { icon: Upload, text: 'Batch upload by Admin', time: '2h ago', color: 'bg-accent-blue/10 text-accent-blue' },
];

export default function ActivityFeed() {
  return (
    <div className="space-y-3">
      {activities.map((activity, i) => (
        <div key={i} className="flex items-start gap-3 py-2">
          <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center shrink-0`}>
            <activity.icon size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary">{activity.text}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
