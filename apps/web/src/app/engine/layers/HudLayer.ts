import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"

export class HudLayer implements CanvasLayer {
  id = "hud"
  visible = true
  isUI = true

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    if (!this.visible) return

    const { scale, cursor, rulerSize } = engine

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    ctx.fillStyle = "rgba(0,0,0,0.6)"
    ctx.font = "12px Arial"

    const zoomText = `Zoom: ${(scale * 100).toFixed(0)}%`
    const coordText = `Cursor: ${engine.worldToUnit(cursor.x).toFixed(2)}, ${engine.worldToUnit(cursor.y).toFixed(2)}`

    ctx.fillText(zoomText, rulerSize + 10, rulerSize + 20)
    ctx.fillText(coordText, rulerSize + 10, rulerSize + 40)

    ctx.restore()
  }
}
// export class HudLayer implements CanvasLayer {
//   id = "hud"
//   visible: boolean = true
//   isUI = true

//   draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
//     ctx.save()
//     ctx.setTransform(1, 0, 0, 1, 0, 0)

//     ctx.fillStyle = "black"
//     ctx.font = "14px Arial"

//     ctx.fillText(`Zoom: ${(engine.scale * 100).toFixed(0)}%`, 20, 50)
//     ctx.fillText(
//       `Cursor: ${engine.cursor.x.toFixed(0)}, ${engine.cursor.y.toFixed(0)}`,
//       20,
//       70
//     )

//     ctx.restore()
//   }
// }