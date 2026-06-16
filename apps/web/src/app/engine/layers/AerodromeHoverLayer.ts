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
    12 / engine.scale

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

  ctx.font =
  `${12 / engine.scale}px Arial`

  ctx.fillStyle =
    "#0080ff"

  ctx.textAlign =
    "left"

  ctx.textBaseline =
    "middle"

  ctx.fillText(
    airport.icao,
    world.x + size + 4 / engine.scale,
    world.y
  )  
  // ctx.fillText(
  //   airport.icao,
  //   world.x,
  //   world.y - size - 4 / engine.scale
  // )

  ctx.restore()
}
  }