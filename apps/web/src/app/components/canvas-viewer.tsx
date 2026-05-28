"use client"
interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export function CanvasViewer({ canvasRef }: Props) {
  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      className="border bg-white shadow"
    />
  )
}
