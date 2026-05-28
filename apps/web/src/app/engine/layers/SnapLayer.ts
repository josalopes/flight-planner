import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"

export class SnapLayer implements CanvasLayer {
  id = "snap"
  visible: boolean = true

  spacingPx = 100

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    const { x, y } = engine.cursor

    const snappedX = Math.round(x / this.spacingPx) * this.spacingPx
    const snappedY = Math.round(y / this.spacingPx) * this.spacingPx

    ctx.beginPath()
    ctx.fillStyle = "blue"

    ctx.arc(snappedX, snappedY, 5 / engine.scale, 0, Math.PI * 2)
    ctx.fill()
  }
}