import { getDistance } from "@/app/utils/get-distance"
import { CanvasEngine } from "../CanvasEngine"
import { GraphicObject } from "./GraphicObject"
import { getBearing } from "@/app/utils/get-bearing"

interface Point {
  x: number
  y: number
}

export class RouteObject implements GraphicObject {
  id = crypto.randomUUID()
  type = "route"
  selected = false

  constructor(
    public start: Point,
    public end: Point,
    public legIndex: number,
    public distanceNm?: number,
    public bearing?: number,
  ) {}

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {
    ctx.save()

    // =========================
    // Linha da rota
    // =========================

    ctx.beginPath()

    const hovered =
      engine.hoveredRoute === this

    ctx.strokeStyle =
      hovered
        ? "#ffff00"
        : "#ff00ff"

    ctx.lineWidth =
      hovered
        ? 4 / engine.scale
        : 2 / engine.scale
    // ctx.strokeStyle =
    //   this.selected
    //     ? "#ff0000"
    //     : "#ff00ff"

    // ctx.lineWidth =
    //   this.selected
    //     ? 3 / engine.scale
    //     : 2 / engine.scale

    ctx.moveTo(
      this.start.x,
      this.start.y
    )

    ctx.lineTo(
      this.end.x,
      this.end.y
    )

    ctx.stroke()

    const t =
      this.distanceNm && this.distanceNm < 50
        ? 0.35
        : 0.5

    const centerX =
      this.start.x +
      (this.end.x - this.start.x) * t

    const centerY =
      this.start.y +
      (this.end.y - this.start.y) * t

    let angle =
      Math.atan2(
        this.end.y - this.start.y,
        this.end.x - this.start.x
      )

    if (
      angle > Math.PI / 2 ||
      angle < -Math.PI / 2
    ) {
      angle += Math.PI
    }

    // =========================
    // Pontos origem/destino
    // =========================

    const radius =
      5 / engine.scale

    ctx.fillStyle =
      this.selected
        ? "#ff0000"
        : "#ff00ff"

    ctx.beginPath()
    ctx.arc(
      this.start.x,
      this.start.y,
      radius,
      0,
      Math.PI * 2
    )
    ctx.fill()

    ctx.beginPath()
    ctx.arc(
      this.end.x,
      this.end.y,
      radius,
      0,
      Math.PI * 2
    )
    ctx.fill()

    // =========================
    // Label opcional
    // =========================

    // if (this.label) {
    //   const centerX =
    //     (this.start.x + this.end.x) / 2

    //   const centerY =
    //     (this.start.y + this.end.y) / 2

    //   ctx.font =
    //     `${12 / engine.scale}px Arial`

    //   ctx.fillStyle = "#000"

    //   ctx.fillText(
    //     this.label,
    //     centerX,
    //     centerY
    //   )
    // }

    // =========================
    // Bounding quando selecionado
    // =========================

    if (this.selected) {
      const bounds =
        this.getBounds()

      ctx.strokeStyle = "#3399ff"

      ctx.lineWidth =
        1 / engine.scale

      ctx.strokeRect(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height
      )
    }

    ctx.restore()

    // =========================
    // Desenha caixa de info
    // =========================
    const bearingText =
      this.bearing
        ?.toFixed(0)
        .padStart(3, "0")

    const line1 = `TRK ${bearingText}°`
    const distanceKm = (this.distanceNm ?? 0) * 1.852
    const line2 = `${this.distanceNm?.toFixed(0)} NM • ${distanceKm.toFixed(0)} KM`  

    const dx = this.end.x - this.start.x
    const dy = this.end.y - this.start.y

    const len = Math.hypot(dx, dy)

    const nx = -dy / len
    const ny = dx / len

    const offset = 30 / engine.scale

    ctx.save()

    ctx.translate(
      centerX + nx * offset, 
      centerY + ny * offset
    )
    
    ctx.font = `${13 / engine.scale}px Arial`
    const width1 = ctx.measureText(line1).width
    
    ctx.font = `${11 / engine.scale}px Arial`
    const width2 = ctx.measureText(line2).width

    const paddingX = 18 / engine.scale

    const textWidth = Math.max(width1, width2)
    const boxWidth = textWidth + paddingX * 2
    const boxHeight = 32 / engine.scale
    const boxY = 0

    const line1Y = 11 / engine.scale
    const line2Y = 23 / engine.scale

    ctx.fillStyle = "rgba(255,255,255,0.75)"

    ctx.strokeStyle = "#333"

    ctx.lineWidth = 1 / engine.scale

    ctx.beginPath()

    ctx.roundRect(
      -boxWidth / 2,
      boxY,
      boxWidth,
      boxHeight,
      4 / engine.scale
    )

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "#000"

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.font = `${13 / engine.scale}px Arial`
    ctx.fillText(
      line1,
      0,
      line1Y
    )

    ctx.font = `${11 / engine.scale}px Arial`
    ctx.fillText(
      line2,
      0,
      line2Y
    )

    ctx.restore()
  }

  hitTest(
    point: Point,
    tolerance: number
  ): boolean {
    const distance =
      this.distanceToSegment(
        point,
        this.start,
        this.end
      )

    return distance <= tolerance
  }

  move(
    dx: number,
    dy: number
  ) {
    this.start.x += dx
    this.start.y += dy

    this.end.x += dx
    this.end.y += dy
  }

  getBounds(): DOMRect {
    const minX =
      Math.min(
        this.start.x,
        this.end.x
      )

    const minY =
      Math.min(
        this.start.y,
        this.end.y
      )

    const maxX =
      Math.max(
        this.start.x,
        this.end.x
      )

    const maxY =
      Math.max(
        this.start.y,
        this.end.y
      )

    return new DOMRect(
      minX,
      minY,
      maxX - minX,
      maxY - minY
    )
  }

  private distanceToSegment(
    p: Point,
    a: Point,
    b: Point
  ) {
    const dx = b.x - a.x
    const dy = b.y - a.y

    if (dx === 0 && dy === 0) {
      return Math.hypot(
        p.x - a.x,
        p.y - a.y
      )
    }

    const t =
      (
        (p.x - a.x) * dx +
        (p.y - a.y) * dy
      ) /
      (
        dx * dx +
        dy * dy
      )

    const clamped =
      Math.max(
        0,
        Math.min(1, t)
      )

    const projX =
      a.x + clamped * dx

    const projY =
      a.y + clamped * dy

    return Math.hypot(
      p.x - projX,
      p.y - projY
    )
  }
}