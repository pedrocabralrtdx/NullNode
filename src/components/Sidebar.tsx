import type { ViewKey } from '../types'
import GlitchText from './GlitchText'
import {
  BellIcon,
  ExploreIcon,
  HomeIcon,
  NetworkIcon,
  ProfileIcon,
  TerminalIcon
} from './Icons'

const navItems: Array<{
  id: ViewKey
  label: string
  icon: JSX.Element
}> = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'explore', label: 'Explore', icon: <ExploreIcon /> },
  { id: 'network', label: 'City Map', icon: <NetworkIcon /> },
  { id: 'terminal', label: 'Terminal', icon: <TerminalIcon /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
  { id: 'profile', label: 'Profile', icon: <ProfileIcon /> }
]

type Props = {
  active: ViewKey
  onSelect: (view: ViewKey) => void
}

export default function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className="flex lg:flex-col gap-4 lg:gap-6">
      <div className="glass-panel px-4 py-3 flex items-center gap-3">
        <div className="h-10 w-10 border border-white/30 bg-black flex items-center justify-center text-lg font-bold text-neon-green">
          N
        </div>
        <div className="font-display text-lg">
          <GlitchText text="// NullNode" className="glitch-hover" />
        </div>
      </div>
      <nav className="glass-panel p-3 flex lg:flex-col gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={[
                'flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200 border border-transparent',
                isActive
                  ? 'bg-white/10 text-white border-white/40 shadow-neon'
                  : 'text-white/70 hover:text-white hover:border-white/25 hover:bg-white/5'
              ].join(' ')}
            >
              <span className={isActive ? 'text-neon-green' : 'text-white/70'}>{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
