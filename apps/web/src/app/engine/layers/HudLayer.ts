import { pixelToLatLon } from "@/app/utils/latlon-to-pixel"
import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"
import { SALVADOR_WAC } from "@/data/chart-catalogue"

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
    const rawText = `Raw: ${cursor.x.toFixed(0)}, ${cursor.y.toFixed(0)}`
    const position =
    pixelToLatLon(
      cursor.x,
      cursor.y,
      SALVADOR_WAC
    )
    
    const positionText = `Geo coords: ${position.lat.toFixed(2)}, ${position.lon.toFixed(2)}`
    
    ctx.fillText(zoomText, rulerSize + 10, rulerSize + 20)
    ctx.fillText(coordText, rulerSize + 10, rulerSize + 40)
    ctx.fillText(rawText, rulerSize + 10, rulerSize + 60)
    ctx.fillText(positionText, rulerSize + 10, rulerSize + 80)

    ctx.restore()
  }
}