"use client"

import { useEffect, useRef } from "react"

export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 256
    canvas.height = 256

    const imageData = ctx.createImageData(256, 256)
    const data = imageData.data

    const loop = () => {
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255
        data[i] = val
        data[i + 1] = val
        data[i + 2] = val
        data[i + 3] = 12
      }
      ctx.putImageData(imageData, 0, 0)
      requestAnimationFrame(loop)
    }
    loop()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40"
      style={{
        zIndex: 3,
        width: "100%",
        height: "100%",
        mixBlendMode: "overlay",
      }}
      aria-hidden="true"
    />
  )
}
