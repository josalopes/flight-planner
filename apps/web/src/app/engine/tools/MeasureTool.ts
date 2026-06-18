import { CanvasEngine } from "../CanvasEngine"
import { Tool } from "../types/Tool"

import { worldToLatLon } from "@/app/utils/world-to-latlon"
import { haversineNm } from "@/app/utils/get-distance"
import { bearing } from "@/app/utils/get-bearing"

export class MeasureTool
  implements Tool {

  id = "measure"

  cursor = "crosshair"

  private startPoint: {
    x: number
    y: number
  } | null = null

  private currentPoint: {
    x: number
    y: number
  } | null = null

  onMouseDown(
    engine: CanvasEngine,
    e: MouseEvent
  ) {
    const world =
      engine.screenToWorld(
        e.offsetX,
        e.offsetY
      )

    // Primeiro clique

    if (!this.startPoint) {

      this.startPoint = world

      this.currentPoint = world

      engine.render()

      return
    }

    // Segundo clique

    this.currentPoint = world

    engine.render()
  }

  onMouseMove(
    engine: CanvasEngine,
    e: MouseEvent
  ) {

    if (!this.startPoint)
      return

    this.currentPoint =
      engine.screenToWorld(
        e.offsetX,
        e.offsetY
      )

    engine.render()
  }

  onKeyDown(
    engine: CanvasEngine,
    e: KeyboardEvent
  ) {
    if (e.key === "Escape") {
      this.startPoint = null
      this.currentPoint = null

      engine.setTool("pan")

      engine.render()
    }
  }

  drawOverlay(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {
    if (
      !this.startPoint ||
      !this.currentPoint
    ) {
      return
    }

    const start =
      engine.worldToScreen(
        this.startPoint.x,
        this.startPoint.y
      )

    const end =
      engine.worldToScreen(
        this.currentPoint.x,
        this.currentPoint.y
      )

    // =====================
    // LINHA
    // =====================

    ctx.save()

    ctx.strokeStyle =
      "#0066ff"

    ctx.lineWidth =
      2 / engine.scale

    ctx.setLineDash([
      8 / engine.scale,
      4 / engine.scale
    ])

    ctx.beginPath()

    ctx.moveTo(
      start.x,
      start.y
    )

    ctx.lineTo(
      end.x,
      end.y
    )

    ctx.stroke()

    ctx.setLineDash([])

    // =====================
    // DISTÂNCIA / RUMO
    // =====================

    const startLatLon =
      worldToLatLon(
        start.x,
        start.y
      )

    const endLatLon =
      worldToLatLon(
        end.x,
        end.y
      )

    const distanceNm =
      haversineNm(
        startLatLon.lat,
        startLatLon.lon,
        endLatLon.lat,
        endLatLon.lon
      )

    const course =
      bearing(
        startLatLon.lat,
        startLatLon.lon,
        endLatLon.lat,
        endLatLon.lon
      )

    const midX =
      (start.x + end.x) / 2

    const midY =
      (start.y + end.y) / 2

    const text =
      `${distanceNm.toFixed(1)} NM | ${course.toFixed(0)}°`

    ctx.font =
      `${14 / engine.scale}px Arial`

    const textWidth =
      ctx.measureText(text).width

    const padding =
      6 / engine.scale

    const boxWidth =
      textWidth +
      padding * 2

    const boxHeight =
      22 / engine.scale

    ctx.fillStyle =
      "rgba(0,0,0,0.85)"

    ctx.beginPath()

    ctx.roundRect(
      midX - boxWidth / 2,
      midY - boxHeight / 2,
      boxWidth,
      boxHeight,
      4 / engine.scale
    )

    ctx.fill()

    ctx.fillStyle =
      "#ffffff"

    ctx.textAlign = "center"

    ctx.textBaseline = "middle"

    ctx.fillText(
      text,
      midX,
      midY
    )

    ctx.restore()
  }
}