type Props = {
  text: string
  className?: string
}

export default function GlitchText({ text, className = '' }: Props) {
  return (
    <span className={`glitch ${className}`} data-text={text}>
      {text}
    </span>
  )
}
