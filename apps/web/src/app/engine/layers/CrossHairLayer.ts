import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"

export class CrosshairLayer implements CanvasLayer {
  id = "crosshair"
  visible = true
  isUI = true

  color = "#ff0000"

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {
    const { scale, offset, cursor } = engine

    const screenX =
      cursor.x * scale +
      offset.x

    const screenY =
      cursor.y * scale +
      offset.y

    ctx.save()

    ctx.setTransform(
      1,
      0,
      0,
      1,
      0,
      0
    )

    ctx.strokeStyle = this.color
    ctx.lineWidth = 1

    ctx.beginPath()

    ctx.moveTo(screenX - 20, screenY)
    ctx.lineTo(screenX - 6, screenY)

    ctx.moveTo(screenX + 6, screenY)
    ctx.lineTo(screenX + 20, screenY)

    ctx.moveTo(screenX, screenY - 20)
    ctx.lineTo(screenX, screenY - 6)

    ctx.moveTo(screenX, screenY + 6)
    ctx.lineTo(screenX, screenY + 20)

    ctx.stroke()

    ctx.restore()
  }
}

