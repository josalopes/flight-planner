import { CanvasEngine } from "../CanvasEngine"
import { GraphicObject } from "./GraphicObject"

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
    public label?: string
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

    ctx.strokeStyle =
      this.selected
        ? "#ff0000"
        : "#ff00ff"

    ctx.lineWidth =
      this.selected
        ? 3 / engine.scale
        : 2 / engine.scale

    ctx.moveTo(
      this.start.x,
      this.start.y
    )

    ctx.lineTo(
      this.end.x,
      this.end.y
    )

    ctx.stroke()

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

    if (this.label) {
      const centerX =
        (this.start.x + this.end.x) / 2

      const centerY =
        (this.start.y + this.end.y) / 2

      ctx.font =
        `${12 / engine.scale}px Arial`

      ctx.fillStyle = "#000"

      ctx.fillText(
        this.label,
        centerX,
        centerY
      )
    }

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