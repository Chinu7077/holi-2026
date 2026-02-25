"use client"

import { useEffect, useRef, useMemo } from "react"

interface FloatingParticle {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  color: string
  speed: number
  angle: number
  amplitude: number
  opacity: number
}

const COLORS = [
  "rgba(255, 20, 147, 0.3)",
  "rgba(255, 107, 53, 0.3)",
  "rgba(255, 215, 0, 0.3)",
  "rgba(0, 204, 102, 0.3)",
  "rgba(65, 105, 225, 0.3)",
  "rgba(255, 0, 255, 0.25)",
]

const GRAYSCALE_COLORS = [
  "rgba(200, 200, 200, 0.15)",
  "rgba(180, 180, 180, 0.12)",
  "rgba(160, 160, 160, 0.1)",
  "rgba(140, 140, 140, 0.08)",
]

export function BackgroundParticles({ isColorful }: { isColorful: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<FloatingParticle[]>([])
  const timeRef = useRef(0)

  const colorSet = useMemo(() => (isColorful ? COLORS : GRAYSCALE_COLORS), [isColorful])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize particles
    if (particlesRef.current.length === 0) {
      const count = Math.min(40, Math.floor((window.innerWidth * window.innerHeight) / 25000))
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          radius: 20 + Math.random() * 60,
          color: colorSet[Math.floor(Math.random() * colorSet.length)],
          speed: 0.002 + Math.random() * 0.004,
          angle: Math.random() * Math.PI * 2,
          amplitude: 30 + Math.random() * 60,
          opacity: 0.1 + Math.random() * 0.2,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      timeRef.current += 0.016

      for (const p of particlesRef.current) {
        p.angle += p.speed
        p.x = p.baseX + Math.sin(p.angle) * p.amplitude
        p.y = p.baseY + Math.cos(p.angle * 0.7) * p.amplitude * 0.6

        // Wrap around
        if (p.x > canvas.width + p.radius) p.baseX = -p.radius
        if (p.x < -p.radius) p.baseX = canvas.width + p.radius
        if (p.y > canvas.height + p.radius) p.baseY = -p.radius
        if (p.y < -p.radius) p.baseY = canvas.height + p.radius

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [colorSet])

  // Update colors when isColorful changes
  useEffect(() => {
    for (const p of particlesRef.current) {
      p.color = colorSet[Math.floor(Math.random() * colorSet.length)]
    }
  }, [colorSet])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
