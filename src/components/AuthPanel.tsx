import { useState } from 'react'
import CyberButton from './CyberButton'

export type AuthPayload = {
  username: string
  handle: string
}

type Props = {
  onAuth: (payload: AuthPayload) => void
}

export default function AuthPanel({ onAuth }: Props) {
  const [mode, setMode] = useState<'signin' | 'create'>('signin')
  const [username, setUsername] = useState('')
  const [handle, setHandle] = useState('')

  const submit = () => {
    if (!username.trim() || !handle.trim()) return
    onAuth({ username, handle: handle.startsWith('@') ? handle : `@${handle}` })
    setUsername('')
    setHandle('')
  }

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Access Node</h3>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setMode('signin')}
            className={mode === 'signin' ? 'text-neon-green' : 'text-white/60'}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('create')}
            className={mode === 'create' ? 'text-neon-green' : 'text-white/60'}
          >
            Create
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Display name"
          className="w-full border border-white/15 bg-black/80 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-neon-green focus:outline-none"
        />
        <input
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          placeholder="Handle"
          className="w-full border border-white/15 bg-black/80 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-neon-green focus:outline-none"
        />
      </div>
      <CyberButton onClick={submit} className="mt-4 w-full" variant="accent">
        {mode === 'signin' ? 'Connect' : 'Create Account'}
      </CyberButton>
      <p className="mt-3 text-xs text-white/60">
        Auth is simulated locally for the UI experience.
      </p>
    </div>
  )
}
