import { latLonToWorld } from "@/app/utils/latlon-to-world";
import { CanvasEngine } from "../CanvasEngine";
import { CanvasLayer } from "../types/CanvasLayer";

export class AerodromeHoverLayer
  implements CanvasLayer {
    id = crypto.randomUUID()
    draw(
  ctx: CanvasRenderingContext2D,
  engine: CanvasEngine
) {
    const airport =
      engine.hoveredAerodrome

    if (!airport)
      return

    const world =
      latLonToWorld(
        airport.lat,
        airport.lon
      )

    const size =
      10 / engine.scale

    ctx.save()

    ctx.strokeStyle =
      "#00aaff"

    ctx.lineWidth =
      2 / engine.scale

    ctx.strokeRect(
      world.x - size,
      world.y - size,
      size * 2,
      size * 2
    )

    ctx.fillStyle =
      "#0080ff"

    ctx.textAlign = "left"
    ctx.textBaseline = "top"

    const textX =
      world.x +
      size +
      8 / engine.scale

    const textY =
      world.y - size - 1 / engine.scale

    // if (engine.scale > 0.20)   {
      ctx.font =
        `bold ${11 / engine.scale}px sans-serif`
  
      ctx.fillText(
        airport.icao,
        textX,
        textY
      )
    // }

    ctx.font =
      `${10 / engine.scale}px sans-serif`

    // if (engine.scale > 0.40) {
      ctx.fillText(
        airport.name,
        textX,
        textY + 12 / engine.scale
      )
    // }
    
    ctx.fillStyle = "#444"

    // if (engine.scale > 0.70) {
      ctx.fillText(
        `${airport.city} / ${airport.uf}`,
        textX,
        textY + 24 / engine.scale
      )
    // }

    ctx.restore()
  }
}