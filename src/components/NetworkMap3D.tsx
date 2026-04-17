import { useEffect, useRef, useState, useCallback } from 'react'
import type { User } from '../types'
import CyberButton from './CyberButton'
import { CityEngine } from '../engine3d/CityEngine'
import { useTheme } from '../app/ThemeContext'

type Props = {
  users: User[]
  currentUserId: string
  onSelectUser: (userId: string) => void
}

export default function NetworkMap3D({ users, currentUserId, onSelectUser }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<CityEngine | null>(null)
  const [hovered, setHovered] = useState<User | null>(null)
  const [isLocked, setIsLocked] = useState(false)

  const { theme } = useTheme()

  useEffect(() => {
    if (!mountRef.current) return

    const engine = new CityEngine({
      container: mountRef.current,
      users,
      currentUserId,
      onUserHover: setHovered,
      onUserSelect: onSelectUser,
      theme,
    })

    engineRef.current = engine

    // Listen for pointer lock changes to update HUD
    const onLockChange = () => {
      setIsLocked(document.pointerLockElement === mountRef.current?.querySelector('canvas'))
    }
    document.addEventListener('pointerlockchange', onLockChange)

    return () => {
      engine.dispose()
      engineRef.current = null
      document.removeEventListener('pointerlockchange', onLockChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync theme to engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.applyTheme(theme)
    }
  }, [theme])

  const handleEnterCity = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.requestPointerLock()
    }
  }, [])

  const handleTeleport = useCallback((userId: string) => {
    if (engineRef.current) {
      engineRef.current.focusUser(userId)
    }
  }, [])

  return (
    <div className="glass-panel p-0 panel-sheen relative overflow-hidden">
      {/* ─── 3D Viewport ─── */}
      <div ref={mountRef} className="h-[580px] w-full relative cursor-pointer" />

      {/* ─── Crosshair (visible when locked) ─── */}
      {isLocked && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
          <div className="relative">
            <div className="w-6 h-px bg-primary/60" />
            <div className="w-px h-6 bg-primary/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* ─── Hover Tooltip ─── */}
      {isLocked && hovered && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-surface/90 border border-primary/50 px-4 py-2 text-center backdrop-blur-sm">
            <div className="text-primary font-bold text-sm tracking-widest uppercase">
              {hovered.handle}
            </div>
            <div className="text-text-muted text-xs mt-0.5">{hovered.username}</div>
            <div className="text-text-muted text-[10px] mt-1 opacity-70">
              ENTER or CLICK to open profile
            </div>
          </div>
        </div>
      )}

      {/* ─── Enter City Overlay (when not locked) ─── */}
      {!isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-bg/50 backdrop-blur-[2px]">
          <div className="text-center space-y-4">
            <div className="text-primary font-mono text-2xl font-bold tracking-[0.4em] uppercase">
              // CITY MAP
            </div>
            <p className="text-text-muted text-sm max-w-xs mx-auto">
              Explore the NullNode city. Walk through neon streets and visit user residences.
            </p>
            <CyberButton variant="accent" size="lg" onClick={handleEnterCity}>
              ▶ ENTER CITY
            </CyberButton>
            <div className="text-text-muted text-[10px] tracking-widest uppercase mt-2 space-y-1">
              <div>WASD / Arrows — Move</div>
              <div>Mouse — Look Around</div>
              <div>ESC — Release Cursor</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom HUD ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-bg/90 to-transparent p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick-travel buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-text-muted uppercase tracking-[0.3em] mr-1">
              TELEPORT:
            </span>
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleTeleport(user.id)}
                className={[
                  'border px-2 py-1 text-[10px] font-mono uppercase tracking-[0.15em] transition-all',
                  user.id === currentUserId
                    ? 'text-primary border-primary/60 bg-primary/10 shadow-[0_0_8px_rgba(124,255,155,0.15)]'
                    : 'text-text-muted border-border hover:text-text hover:border-text-muted',
                ].join(' ')}
              >
                {user.handle}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 text-[10px] text-text-muted uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              {isLocked ? 'EXPLORING' : 'PAUSED'}
            </span>
            <span>{users.length} RESIDENCES</span>
          </div>
        </div>
      </div>
    </div>
  )
}
