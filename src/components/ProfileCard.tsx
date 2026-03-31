import type { User } from '../types'
import CyberButton from './CyberButton'
import GlitchText from './GlitchText'

type Props = {
  user: User
  postsCount: number
  isCurrentUser?: boolean
  onFollow?: (userId: string) => void
}

export default function ProfileCard({ user, postsCount, isCurrentUser = false, onFollow }: Props) {
  return (
    <div className="glass-panel p-6 panel-sheen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 border border-white/25 bg-black flex items-center justify-center text-xl font-bold text-white">
            {user.avatar}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-lg font-semibold">
                <GlitchText text={user.username} />
              </div>
              <span className="border border-neon-green/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.4em] text-neon-green">
                ACTIVE
              </span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.35em] text-neon-green">{user.handle}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isCurrentUser ? (
            <CyberButton variant="accent">Edit Profile</CyberButton>
          ) : (
            <CyberButton variant="accent" onClick={() => onFollow?.(user.id)}>
              Follow
            </CyberButton>
          )}
          <CyberButton variant="ghost">Message</CyberButton>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="border border-white/15 bg-black/70 p-3 text-center">
          <div className="text-xs text-white/60">Posts</div>
          <div className="mt-1 text-lg font-semibold text-white">{postsCount}</div>
        </div>
        <div className="border border-white/15 bg-black/70 p-3 text-center">
          <div className="text-xs text-white/60">Followers</div>
          <div className="mt-1 text-lg font-semibold text-white">{user.followers}</div>
        </div>
        <div className="border border-white/15 bg-black/70 p-3 text-center">
          <div className="text-xs text-white/60">Following</div>
          <div className="mt-1 text-lg font-semibold text-white">{user.following}</div>
        </div>
        <div className="border border-white/15 bg-black/70 p-3 text-center">
          <div className="text-xs text-white/60">Signal</div>
          <div className="mt-1 text-lg font-semibold text-neon-green">98%</div>
        </div>
      </div>

      <div className="mt-5 border border-white/15 bg-black/70 p-4">
        <div className="text-xs uppercase tracking-[0.3em] text-white/50">Bio</div>
        <p className="mt-2 text-sm text-white/80 leading-relaxed">{user.bio}</p>
      </div>
    </div>
  )
}
