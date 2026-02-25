"use client"

import { useCallback, useEffect, useRef } from "react"

interface PetalParticle {
  x: number
  y: number
  rotation: number
  rotationSpeed: number
  size: number
  speed: number
  sway: number
  swaySpeed: number
  phase: number
  opacity: number
  color: string
}

const PETAL_COLORS_GRAY = ["#aaa", "#bbb", "#999", "#ccc"]
const PETAL_COLORS_COLOR = ["#FF1493", "#FF6B35", "#FFD700", "#00CC66", "#4169E1", "#FF69B4"]

export function FloatingPetals({ isColorful }: { isColorful: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const petalsRef = useRef<PetalParticle[]>([])

  const createPetal = useCallback(
    (canvasW: number, canvasH: number, fromTop = true): PetalParticle => {
      const colors = isColorful ? PETAL_COLORS_COLOR : PETAL_COLORS_GRAY
      return {
        x: Math.random() * canvasW,
        y: fromTop ? -20 : Math.random() * canvasH,
        rotation: Math.random() * 360,
        rotationSpeed: 0.5 + Math.random() * 2,
        size: 4 + Math.random() * 8,
        speed: 0.3 + Math.random() * 0.8,
        sway: 30 + Math.random() * 40,
        swaySpeed: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }
    },
    [isColorful]
  )

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

    if (petalsRef.current.length === 0) {
      const count = Math.min(25, Math.floor(window.innerWidth / 50))
      for (let i = 0; i < count; i++) {
        petalsRef.current.push(createPetal(canvas.width, canvas.height, false))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = petalsRef.current.length - 1; i >= 0; i--) {
        const p = petalsRef.current[i]
        p.y += p.speed
        p.phase += p.swaySpeed
        p.x += Math.sin(p.phase) * 0.5
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity

        // Draw petal shape
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.restore()

        if (p.y > canvas.height + 20) {
          petalsRef.current[i] = createPetal(canvas.width, canvas.height, true)
        }
      }

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [createPetal])

  useEffect(() => {
    const colors = isColorful ? PETAL_COLORS_COLOR : PETAL_COLORS_GRAY
    for (const p of petalsRef.current) {
      p.color = colors[Math.floor(Math.random() * colors.length)]
    }
  }, [isColorful])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  )
}
