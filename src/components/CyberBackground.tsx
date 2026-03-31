import { useEffect, useRef } from 'react'

type Sweep = {
  x: number
  y: number
  speed: number
  angle: number
}

const buildSweeps = () =>
  Array.from({ length: 3 }, () => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.00035 + Math.random() * 0.0004,
    angle: Math.random() * Math.PI * 2
  }))

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let animationId = 0
    let sweeps = buildSweeps()

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const ratio = window.devicePixelRatio || 1
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 120) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 120) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    const drawDots = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
      for (let i = 0; i < 120; i += 1) {
        const x = (i * 97) % width
        const y = ((i * 53) % height) + (Math.sin(Date.now() * 0.0002 + i) * 12)
        ctx.fillRect(x, y, 1.2, 1.2)
      }
    }

    const drawSweeps = () => {
      sweeps = sweeps.map((sweep) => {
        const next = {
          ...sweep,
          x: (sweep.x + Math.cos(sweep.angle) * sweep.speed) % 1,
          y: (sweep.y + Math.sin(sweep.angle) * sweep.speed) % 1
        }
        const x = next.x * width
        const y = next.y * height
        ctx.strokeStyle = 'rgba(124, 255, 155, 0.18)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x - 80, y)
        ctx.lineTo(x + 160, y)
        ctx.stroke()
        return next
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(1, 'rgba(124, 255, 155, 0.08)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      drawGrid()
      drawDots()
      drawSweeps()
      animationId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}
