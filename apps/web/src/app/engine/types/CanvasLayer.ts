import type { CanvasEngine } from "../CanvasEngine"

export interface CanvasLayer {
  id: string
  visible?: boolean
  isUI?: boolean
  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ): void
}