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
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col gap-6">
        <div className="glass-panel px-4 py-3 flex items-center gap-3">
          <div className="h-10 w-10 border border-border bg-surface flex items-center justify-center text-lg font-bold text-primary">
            N
          </div>
          <div className="font-display text-lg">
            <GlitchText text="// NullNode" className="glitch-hover" />
          </div>
        </div>
        <nav className="glass-panel p-3 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.id === active
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={[
                  'flex items-center gap-3 px-3 py-3 text-sm transition-all duration-200 border border-transparent rounded-sm',
                  isActive
                    ? 'bg-primary/10 text-text border-primary/40 shadow-neon'
                    : 'text-text-muted hover:text-text hover:border-border/50 hover:bg-surface-elevated'
                ].join(' ')}
              >
                <span className={isActive ? 'text-primary' : 'text-text-muted'}>{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border shadow-[0_-5px_20px_rgba(0,0,0,0.5)] flex justify-between items-center px-4 py-2 pb-safe">
        {navItems.map((item) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={[
                'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors',
                isActive ? 'text-primary' : 'text-text-muted hover:text-text'
              ].join(' ')}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
