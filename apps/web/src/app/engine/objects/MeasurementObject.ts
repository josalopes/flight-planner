import { GraphicObject } from "./GraphicObject"
import { CanvasEngine } from "../CanvasEngine"

interface Point {
  x: number
  y: number
}

export class MeasurementObject
  implements GraphicObject {

  id = crypto.randomUUID()

  type = "measurement"

  selected = false

  constructor(
    public start: Point,
    public end: Point,
    public distanceNm: number,
    public bearing: number
  ) {}

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {

    ctx.save()

    ctx.strokeStyle = "#0066ff"

    ctx.lineWidth =
      2 / engine.scale

    ctx.beginPath()

    ctx.moveTo(
      this.start.x,
      this.start.y
    )

    ctx.lineTo(
      this.end.x,
      this.end.y
    )

    ctx.stroke()

    const midX =
      (this.start.x + this.end.x) / 2

    const midY =
      (this.start.y + this.end.y) / 2

    ctx.font =
      `${12 / engine.scale}px Arial`

    ctx.fillStyle =
      "#000000"

    ctx.fillText(
      `${this.distanceNm.toFixed(1)} NM | ${this.bearing.toFixed(0)}°`,
      midX,
      midY
    )

    ctx.restore()
  }

  hitTest() {
    return false
  }

  move() {}

  getBounds() {
    return new DOMRect()
  }
}