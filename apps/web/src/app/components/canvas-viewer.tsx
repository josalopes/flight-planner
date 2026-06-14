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
        h-[calc(100vh-20px)]
        border
        bg-white
        shadow
      "
    />
  )
}
