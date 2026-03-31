import CyberButton from './CyberButton'

const MAX_LENGTH = 280

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function Composer({ value, onChange, onSubmit }: Props) {
  const remaining = MAX_LENGTH - value.length

  return (
    <div className="glass-panel p-5 panel-sheen">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Compose Signal</h3>
        <span className={`text-xs ${remaining < 20 ? 'text-neon-green' : 'text-white/60'}`}>
          {remaining} left
        </span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder="Share a signal with the network..."
        className="mt-4 w-full resize-none border border-white/15 bg-black/80 p-4 text-sm text-white placeholder:text-white/40 focus:border-neon-green focus:outline-none"
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-white/60">Text-only posts · 280 chars max</div>
        <CyberButton onClick={onSubmit} disabled={!value.trim()}>
          Broadcast
        </CyberButton>
      </div>
    </div>
  )
}
