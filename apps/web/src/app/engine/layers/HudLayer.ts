import { decimalToDMS } from "@/app/utils/decimal-to-dms"
import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"
import { worldToLatLon } from "@/app/utils/world-to-latlon"
import { findChartByLatLon } from "@/server/aisweb/find-chart"

export class HudLayer implements CanvasLayer {
  id = "hud"

  visible = true
  isUI = true

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {
    const { scale, cursor } = engine

    const pos =
      worldToLatLon(
        cursor.x,
        cursor.y
      )

    const latDMS =
      decimalToDMS(
        pos.lat,
        "lat"
    )

    const lonDMS =
      decimalToDMS(
        pos.lon,
        "lon"
    )  

    const chart =
      findChartByLatLon(
        pos.lat,
        pos.lon
    )

    ctx.save()

    ctx.setTransform(
      1,
      0,
      0,
      1,
      0,
      0
    )

    ctx.fillStyle =
      "rgba(0,0,0,0.3)"

    ctx.fillRect(
      10,
      10,
      240,
      125
    )

    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"

    ctx.fillText(
      `Zoom: ${(scale * 100).toFixed(0)}%`,
      20,
      35
    )

    ctx.fillText(
      `World: ${cursor.x.toFixed(0)}, ${cursor.y.toFixed(0)}`,
      20,
      55
    )

    ctx.fillText(
      `Lat: ${pos.lat.toFixed(4)} ${latDMS}`,
      20,
      75
    )

    ctx.fillText(
      `Lon: ${pos.lon.toFixed(4)} ${lonDMS}`,
      20,
      95
    )

    ctx.fillText(
      `Carta: ${chart?.id ?? ""} ${chart?.name ?? ""}` ,
      20,
      115
    )

    ctx.restore()
  }
}
