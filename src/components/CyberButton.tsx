import { type ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-transparent text-white border-white/30 hover:border-neon-green/60',
  ghost: 'bg-white/5 text-white/70 border-white/15 hover:border-neon-green/60',
  accent: 'bg-neon-green/20 text-white border-neon-green/50 hover:bg-neon-green/30'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm'
}

export default function CyberButton({
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: Props) {
  return (
    <button
      className={[
        'rounded-none border font-mono uppercase tracking-[0.2em] transition-all duration-200',
        'shadow-[0_8px_18px_rgba(0,0,0,0.12)] hover:shadow-neon',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      ].join(' ')}
      {...rest}
    />
  )
}
