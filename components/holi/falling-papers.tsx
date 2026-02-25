"use client"

import { useEffect, useRef, useCallback } from "react"

// ---- Types ----
interface FallingElement {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  rotationSpeed: number
  fallSpeed: number
  swayAmplitude: number
  swayFrequency: number
  swayPhase: number
  opacity: number
  fadeStart: number // y-ratio at which to start fading (0-1)
  color: string
  glowColor: string
  depth: number // 0 = far, 1 = near — affects size, speed, opacity
  type: "strip" | "gulal" | "petal" | "smoke"
}

// ---- Constants ----
const HOLI_COLORS = [
  "#FF1493", // hot pink
  "#FF6B35", // orange
  "#FFD700", // yellow / gold
  "#00CC66", // green
  "#4169E1", // royal blue
  "#FF00FF", // magenta
]

const BASE_COUNT = 50 // min elements on small screen
const MAX_COUNT = 90 // cap for large screens
const BURST_EXTRA = 60 // extra elements on burst
const BURST_DURATION = 3000 // ms
const SHAKE_EXTRA = 100
const SHAKE_DURATION = 2000

// ---- Helpers ----
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function createElement(
  canvasW: number,
  _canvasH: number,
  fromTop: boolean,
  fast: boolean
): FallingElement {
  const depth = Math.random() // 0 = far, 1 = near
  const depthScale = lerp(0.4, 1, depth)
  const type = randomPick<FallingElement["type"]>(["strip", "strip", "gulal", "gulal", "petal", "smoke"])
  const color = randomPick(HOLI_COLORS)

  let width: number, height: number
  switch (type) {
    case "strip":
      width = lerp(3, 8, depth) * depthScale
      height = lerp(14, 30, Math.random()) * depthScale
      break
    case "gulal":
      width = height = lerp(2, 6, Math.random()) * depthScale
      break
    case "petal":
      width = lerp(5, 12, Math.random()) * depthScale
      height = width * lerp(0.4, 0.7, Math.random())
      break
    case "smoke":
      width = height = lerp(12, 28, Math.random()) * depthScale
      break
  }

  const baseFallSpeed = lerp(0.6, 2.2, depth)

  return {
    x: Math.random() * canvasW,
    y: fromTop ? -(Math.random() * 100 + 20) : -(Math.random() * _canvasH),
    width,
    height,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * (type === "strip" ? 4 : 2),
    fallSpeed: (fast ? baseFallSpeed * 2.5 : baseFallSpeed) + Math.random() * 0.5,
    swayAmplitude: lerp(10, 50, Math.random()),
    swayFrequency: lerp(0.005, 0.02, Math.random()),
    swayPhase: Math.random() * Math.PI * 2,
    opacity: lerp(0.3, 0.85, depth),
    fadeStart: lerp(0.6, 0.9, Math.random()),
    color,
    glowColor: color,
    depth,
    type,
  }
}

// ---- Draw functions ----
function drawStrip(
  ctx: CanvasRenderingContext2D,
  el: FallingElement
) {
  ctx.save()
  ctx.translate(el.x, el.y)
  ctx.rotate((el.rotation * Math.PI) / 180)
  ctx.globalAlpha = el.opacity

  // Slight glow
  ctx.shadowBlur = 6 * el.depth
  ctx.shadowColor = el.glowColor

  // Rounded rect streamer
  const r = el.width * 0.4
  ctx.beginPath()
  ctx.roundRect(-el.width / 2, -el.height / 2, el.width, el.height, r)
  ctx.fillStyle = el.color
  ctx.fill()

  ctx.shadowBlur = 0
  ctx.restore()
}

function drawGulal(
  ctx: CanvasRenderingContext2D,
  el: FallingElement
) {
  ctx.save()
  ctx.translate(el.x, el.y)
  ctx.globalAlpha = el.opacity

  ctx.shadowBlur = 8 * el.depth
  ctx.shadowColor = el.glowColor

  ctx.beginPath()
  ctx.arc(0, 0, el.width / 2, 0, Math.PI * 2)
  ctx.fillStyle = el.color
  ctx.fill()

  ctx.shadowBlur = 0
  ctx.restore()
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  el: FallingElement
) {
  ctx.save()
  ctx.translate(el.x, el.y)
  ctx.rotate((el.rotation * Math.PI) / 180)
  ctx.globalAlpha = el.opacity

  ctx.shadowBlur = 4 * el.depth
  ctx.shadowColor = el.glowColor

  ctx.beginPath()
  ctx.ellipse(0, 0, el.width / 2, el.height / 2, 0, 0, Math.PI * 2)
  ctx.fillStyle = el.color
  ctx.fill()

  ctx.shadowBlur = 0
  ctx.restore()
}

function drawSmoke(
  ctx: CanvasRenderingContext2D,
  el: FallingElement
) {
  ctx.save()
  ctx.translate(el.x, el.y)
  ctx.globalAlpha = el.opacity * 0.35

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, el.width / 2)
  grad.addColorStop(0, el.color)
  grad.addColorStop(1, "transparent")

  ctx.beginPath()
  ctx.arc(0, 0, el.width / 2, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  ctx.restore()
}

const DRAW_MAP: Record<FallingElement["type"], (ctx: CanvasRenderingContext2D, el: FallingElement) => void> = {
  strip: drawStrip,
  gulal: drawGulal,
  petal: drawPetal,
  smoke: drawSmoke,
}

// ---- Component ----
interface FallingPapersProps {
  isColorful: boolean
  burstSignal: number // increment to trigger double-tap burst
  shakeSignal: number // increment to trigger shake explosion
}

export function FallingPapers({ isColorful, burstSignal, shakeSignal }: FallingPapersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const elementsRef = useRef<FallingElement[]>([])
  const speedMultiplierRef = useRef(1)
  const lastBurstRef = useRef(burstSignal)
  const lastShakeRef = useRef(shakeSignal)

  // Burst handler: temporary speed increase + extra elements
  useEffect(() => {
    if (burstSignal <= lastBurstRef.current) {
      lastBurstRef.current = burstSignal
      return
    }
    lastBurstRef.current = burstSignal

    const canvas = canvasRef.current
    if (!canvas) return

    // Increase speed
    speedMultiplierRef.current = 2.5
    const timeout = setTimeout(() => {
      speedMultiplierRef.current = 1
    }, BURST_DURATION)

    // Add extra burst elements
    for (let i = 0; i < BURST_EXTRA; i++) {
      elementsRef.current.push(createElement(canvas.width, canvas.height, true, true))
    }

    return () => clearTimeout(timeout)
  }, [burstSignal])

  // Shake handler: massive rain + optional vibration
  useEffect(() => {
    if (shakeSignal <= lastShakeRef.current) {
      lastShakeRef.current = shakeSignal
      return
    }
    lastShakeRef.current = shakeSignal

    const canvas = canvasRef.current
    if (!canvas) return

    speedMultiplierRef.current = 3
    const timeout = setTimeout(() => {
      speedMultiplierRef.current = 1
    }, SHAKE_DURATION)

    // Massive rain
    for (let i = 0; i < SHAKE_EXTRA; i++) {
      elementsRef.current.push(createElement(canvas.width, canvas.height, true, true))
    }

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50, 30, 80])
    }

    return () => clearTimeout(timeout)
  }, [shakeSignal])

  // Initialize canvas + animation loop
  const initCalled = useRef(false)

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

    // Create initial elements once
    if (!initCalled.current) {
      initCalled.current = true
      const count = Math.min(
        MAX_COUNT,
        Math.max(BASE_COUNT, Math.floor((window.innerWidth * window.innerHeight) / 12000))
      )
      for (let i = 0; i < count; i++) {
        elementsRef.current.push(createElement(canvas.width, canvas.height, false, false))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const h = canvas.height
      const w = canvas.width
      const speedMul = speedMultiplierRef.current

      for (let i = elementsRef.current.length - 1; i >= 0; i--) {
        const el = elementsRef.current[i]

        // Physics
        el.y += el.fallSpeed * speedMul
        el.swayPhase += el.swayFrequency
        el.x += Math.sin(el.swayPhase) * el.swayAmplitude * 0.02
        el.rotation += el.rotationSpeed * speedMul

        // Fade near bottom
        const yRatio = el.y / h
        if (yRatio > el.fadeStart) {
          const fadePct = (yRatio - el.fadeStart) / (1 - el.fadeStart)
          el.opacity = Math.max(0, lerp(el.depth * 0.85, 0, fadePct))
        }

        // Draw
        DRAW_MAP[el.type](ctx, el)

        // Recycle when off-screen
        if (el.y > h + 40 || el.opacity <= 0) {
          // If we have more than MAX_COUNT, remove excess from bursts
          if (elementsRef.current.length > MAX_COUNT) {
            elementsRef.current.splice(i, 1)
          } else {
            elementsRef.current[i] = createElement(w, h, true, false)
          }
        }
      }

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  // Update colors when toggling colorful
  useEffect(() => {
    if (!isColorful) return
    for (const el of elementsRef.current) {
      const c = randomPick(HOLI_COLORS)
      el.color = c
      el.glowColor = c
    }
  }, [isColorful])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 4 }}
      aria-hidden="true"
    />
  )
}
