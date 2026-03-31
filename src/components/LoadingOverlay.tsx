import { useEffect, useState } from 'react'
import { SpiralAnimation } from './ui/spiral-animation'

type Props = {
  onFinish?: () => void
}

export default function LoadingOverlay({ onFinish }: Props) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fade = window.setTimeout(() => setFadeOut(true), 800)
    const done = window.setTimeout(() => onFinish?.(), 1400)
    return () => {
      window.clearTimeout(fade)
      window.clearTimeout(done)
    }
  }, [onFinish])

  return (
    <div
      className={[
        'fixed inset-0 z-50 bg-black transition-opacity duration-700',
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      ].join(' ')}
    >
      <SpiralAnimation />
      <div
        className={[
          'absolute inset-0 flex items-center justify-center',
          'transition-all duration-700 ease-out'
        ].join(' ')}
      >
        <div className="text-center">
          <div className="text-2xl font-semibold tracking-[0.35em] text-white">NullNode</div>
        </div>
      </div>
    </div>
  )
}
