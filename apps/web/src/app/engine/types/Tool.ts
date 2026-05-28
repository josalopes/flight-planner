import { CanvasEngine } from "../CanvasEngine"

export interface Tool {
  id: string
  cursor?: string

  onMouseDown?(engine: CanvasEngine, e: MouseEvent): void
  onMouseUp?(engine: CanvasEngine, e: MouseEvent): void
  onMouseMove?(engine: CanvasEngine, e: MouseEvent): void
  onKeyDown?(engine: CanvasEngine, e: KeyboardEvent): void
  onKeyUp?(engine: CanvasEngine, e: KeyboardEvent): void

  drawOverlay?(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ): void
}