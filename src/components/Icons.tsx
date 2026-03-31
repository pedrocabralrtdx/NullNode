import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
})

export function HomeIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h5v-4.5h4V20h5V10.5" />
    </svg>
  )
}

export function ExploreIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" />
    </svg>
  )
}

export function NetworkIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M7 12h10" />
      <path d="M7 12 17 6" />
      <path d="M7 12l10 6" />
    </svg>
  )
}

export function TerminalIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m7 10 2 2-2 2" />
      <path d="M12 14h5" />
    </svg>
  )
}

export function BellIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M18 16v-5a6 6 0 0 0-12 0v5" />
      <path d="M5 16h14" />
      <path d="M9 19a3 3 0 0 0 6 0" />
    </svg>
  )
}

export function ProfileIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  )
}

export function SearchIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function HeartIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M20 8.5c0 4-8 9-8 9s-8-5-8-9a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 8.5Z" />
    </svg>
  )
}

export function CommentIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 6h16v9H8l-4 4Z" />
    </svg>
  )
}

export function RepostIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M7 7h10v4" />
      <path d="M17 17H7v-4" />
      <path d="m13 3 4 4-4 4" />
      <path d="m11 21-4-4 4-4" />
    </svg>
  )
}
