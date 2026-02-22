import { MoreHorizontal, Shield, User } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

export default function UsersTable({ users = [], onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-color">
            {['User', 'Role', 'Analyses', 'Status', 'Joined', 'Actions'].map((col) => (
              <th
                key={col}
                className="text-left py-3 px-4 text-[11px] uppercase tracking-wider text-text-muted font-medium"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border-color/50 hover:bg-bg-glass transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.full_name || user.email} size={36} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{user.full_name || 'Unknown'}</p>
                    <p className="text-[11px] text-text-muted">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant={user.role === 'admin' ? 'purple' : 'default'}>
                  {user.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                  {user.role || 'user'}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm text-text-primary">
                {user.analyses_count ?? 0}
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                  user.is_active !== false ? 'text-accent-green' : 'text-accent-red'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    user.is_active !== false ? 'bg-accent-green' : 'bg-accent-red'
                  }`} />
                  {user.is_active !== false ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '--'}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onDelete?.(user.id)}
                  className="w-8 h-8 rounded-lg border border-border-color flex items-center justify-center text-text-muted hover:border-accent-blue hover:text-accent-blue transition-all"
                >
                  <MoreHorizontal size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
