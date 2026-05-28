import { CanvasEngine } from "../CanvasEngine"

export interface CanvasTool {
  id: string

  onMouseDown?(engine: CanvasEngine, e: MouseEvent): void
  onMouseMove?(engine: CanvasEngine, e: MouseEvent): void
  onMouseUp?(engine: CanvasEngine): void
  onKeyDown?(engine: CanvasEngine, e: KeyboardEvent): void
}