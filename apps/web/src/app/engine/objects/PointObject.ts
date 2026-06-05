import { GraphicObject } from "./GraphicObject"

export class PointObject
  implements GraphicObject {

  id = crypto.randomUUID()

  type = "point"

  constructor(
    public x: number,
    public y: number,
    public label?: string,
    public radius = 6
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()

    ctx.beginPath()

    ctx.arc(
      this.x,
      this.y,
      10,
      0,
      Math.PI * 2
    )

    ctx.fillStyle = "red"
    ctx.fill()

    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.restore()


    if (this.label) {
      ctx.fillStyle = "black"
      ctx.fillText(
        this.label,
        this.x + 15,
        this.y - 15
      )
    }
  }

  hitTest() {
    return false
  }

  getBounds() {
    return new DOMRect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    )
  }

  move(
    dx: number,
    dy: number
  ) {
    this.x += dx
    this.y += dy
  }
}