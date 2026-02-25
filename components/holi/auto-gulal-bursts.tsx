"use client"

import { useEffect, useRef, useState } from "react"

type Direction = "top" | "bottom" | "left" | "right"

interface Burst {
  id: number
  x: number
  y: number
  color: string
  direction: Direction
  size: number
}

const COLORS = [
  "rgba(255, 20, 147, 0.85)", // pink
  "rgba(255, 215, 0, 0.9)", // yellow
  "rgba(65, 105, 225, 0.9)", // blue
  "rgba(0, 204, 102, 0.9)", // green
]

const MAX_BURSTS = 16
const MIN_INTERVAL = 380
const MAX_INTERVAL = 900
const BASE_SIZE = 140

export function AutoGulalBursts() {
  const [bursts, setBursts] = useState<Burst[]>([])
  const idRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const scheduleNext = () => {
      const delay =
        MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)
      timeoutRef.current = window.setTimeout(() => {
        setBursts((prev) => {
          const next: Burst[] = [...prev]

          const direction: Direction = ["top", "bottom", "left", "right"][
            Math.floor(Math.random() * 4)
          ] as Direction

          const edgeOffset = 10 // avoid exact corners
          let x = 50
          let y = 50

          if (direction === "top" || direction === "bottom") {
            x = edgeOffset + Math.random() * (100 - edgeOffset * 2)
            y = direction === "top" ? 5 : 95
          } else {
            y = edgeOffset + Math.random() * (100 - edgeOffset * 2)
            x = direction === "left" ? 5 : 95
          }

          const color = COLORS[Math.floor(Math.random() * COLORS.length)]
          const sizeScale = 0.7 + Math.random() * 0.9

          next.push({
            id: idRef.current++,
            x,
            y,
            color,
            direction,
            size: BASE_SIZE * sizeScale,
          })

          // keep memory / DOM small on mobile
          if (next.length > MAX_BURSTS) {
            next.splice(0, next.length - MAX_BURSTS)
          }

          return next
        })

        scheduleNext()
      }, delay)
    }

    scheduleNext()

    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 2 }}
    >
      {bursts.map((burst) => {
        const { id, x, y, color, direction, size } = burst

        const directionClass =
          direction === "top"
            ? "holi-burst-from-top"
            : direction === "bottom"
            ? "holi-burst-from-bottom"
            : direction === "left"
            ? "holi-burst-from-left"
            : "holi-burst-from-right"

        return (
          <div
            key={id}
            className={`holi-burst ${directionClass}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle at center, ${color} 0%, rgba(255,255,255,0.35) 18%, rgba(255,255,255,0.18) 32%, rgba(255,255,255,0.04) 52%, rgba(255,255,255,0) 70%)`,
            }}
          />
        )
      })}
    </div>
  )
}

