import type { Trend, User } from '../types'
import CyberButton from './CyberButton'

type Props = {
  trends: Trend[]
  users: User[]
  onFollow: (userId: string) => void
  onProfileSelect: (userId: string) => void
}

export default function RightSidebar({ trends, users, onFollow, onProfileSelect }: Props) {
  return (
    <aside className="space-y-6">
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Trending</h3>
          <span className="text-xs uppercase tracking-[0.35em] text-neon-green">Live</span>
        </div>
        <div className="mt-4 space-y-3">
          {trends.map((trend) => (
            <div key={trend.id} className="flex items-center justify-between text-sm">
              <span className="text-neon-green">{trend.topic}</span>
              <span className="text-xs text-white/60">{trend.mentions}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white">Suggested</h3>
        <div className="mt-4 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3">
              <button onClick={() => onProfileSelect(user.id)} className="text-left">
                <div className="text-sm text-white hover:text-neon-green">{user.username}</div>
                <div className="text-xs text-neon-green">{user.handle}</div>
              </button>
              <CyberButton size="sm" variant="ghost" onClick={() => onFollow(user.id)}>
                Follow
              </CyberButton>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-xs text-white/60">No new nodes to follow.</div>
          )}
        </div>
      </div>
    </aside>
  )
}
