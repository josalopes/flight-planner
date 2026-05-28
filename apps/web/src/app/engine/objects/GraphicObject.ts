import { CanvasEngine } from "../CanvasEngine"

export interface GraphicObject {
  id: string
  type: string
  selected?: boolean

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine): void
  hitTest(point: { x: number; y: number }, tolerance: number): boolean
  getBounds(): DOMRect

  move(dx: number, dy: number): void
}