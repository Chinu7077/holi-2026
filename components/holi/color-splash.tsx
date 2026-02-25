"use client"

import { useCallback, useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  decay: number
}

const HOLI_COLORS = [
  "#FF1493", "#FF6B35", "#FFD700", "#00CC66", "#4169E1",
  "#FF00FF", "#FF4500", "#00BFFF", "#FF69B4", "#32CD32",
  "#FFA500", "#8A2BE2", "#DC143C", "#00FA9A", "#FF1744",
]

export function useColorSplash() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.style.position = "fixed"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.pointerEvents = "none"
    canvas.style.zIndex = "50"
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    const animate = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.01)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15
        p.alpha -= p.decay

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace(")", `, ${p.alpha})`)
          .replace("rgb", "rgba")
          .replace("#", "")
        
        const hex = p.color
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`
        
        ctx.shadowBlur = 15
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.5})`
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", handleResize)
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [])

  const triggerSplash = useCallback((x: number, y: number, count = 80) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const speed = 3 + Math.random() * 8
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 3 + Math.random() * 8,
        color: HOLI_COLORS[Math.floor(Math.random() * HOLI_COLORS.length)],
        alpha: 1,
        decay: 0.008 + Math.random() * 0.01,
      })
    }
    particlesRef.current.push(...newParticles)
  }, [])

  const triggerConfetti = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.width
    const newParticles: Particle[] = []
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        x: Math.random() * w,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        radius: 2 + Math.random() * 4,
        color: HOLI_COLORS[Math.floor(Math.random() * HOLI_COLORS.length)],
        alpha: 1,
        decay: 0.003 + Math.random() * 0.005,
      })
    }
    particlesRef.current.push(...newParticles)
  }, [])

  return { triggerSplash, triggerConfetti }
}
