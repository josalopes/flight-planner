import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"

export class SubdivisionLayer implements CanvasLayer {
  id = "subdivision"
  visible: boolean = true
  isUI = false

  spacingPx = 100
  color = "#cccccc"

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    const canvas = engine.getCanvas()
    const width = canvas.width
    const height = canvas.height

    const subSpacing = this.spacingPx / 10

    ctx.beginPath()
    ctx.lineWidth = 0.3 / engine.scale
    ctx.strokeStyle = this.color

    for (let x = 0; x <= width; x += subSpacing) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }

    for (let y = 0; y <= height; y += subSpacing) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }

    ctx.stroke()
  }
}