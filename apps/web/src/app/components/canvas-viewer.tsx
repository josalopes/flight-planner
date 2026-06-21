"use client"
interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}
export function CanvasViewer({
  canvasRef
}: Props) {
  return (
    <canvas
      ref={canvasRef}
      className="
        w-full
        h-full
        border
        bg-white
        shadow
      "
    />
  )
}
