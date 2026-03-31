import type { Notification } from '../types'
import { timeAgo } from '../lib/time'

const tones = {
  info: 'border-white/15 text-white',
  warning: 'border-white/15 text-white',
  success: 'border-neon-green/60 text-white'
}

type Props = {
  notification: Notification
}

export default function NotificationCard({ notification }: Props) {
  return (
    <div className={`glass-panel p-4 border ${tones[notification.tone]}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase tracking-[0.3em]">{notification.title}</span>
        <span className="text-white/60">{timeAgo(notification.timestamp)}</span>
      </div>
      <p className="mt-2 text-sm text-white/80">{notification.detail}</p>
    </div>
  )
}
