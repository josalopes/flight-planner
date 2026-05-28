import { CanvasEngine } from "../CanvasEngine"
import { TransformableObject } from "../types/TransformableObject"
import { GraphicObject } from "./GraphicObject"

export class DistanceObject implements GraphicObject, TransformableObject {
  id = crypto.randomUUID()
  type = "distance"
  selected = false

  constructor(
    public start: { x: number; y: number },
    public end: { x: number; y: number }
  ) {}

  // =========================
  // DRAW
  // =========================
  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    ctx.beginPath()
    ctx.strokeStyle = this.selected ? "#ff0000" : "#0077ff"
    ctx.lineWidth = 2 / engine.scale
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.stroke()

    if (this.selected) {
      this.drawHandles(ctx, engine)
      this.drawBoundingBox(ctx, engine)
    }
  }

  private drawHandles(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    const r = 6 / engine.scale

    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#ff0000"

    ctx.beginPath()
    ctx.arc(this.start.x, this.start.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(this.end.x, this.end.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  private drawBoundingBox(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    const b = this.getBounds()

    ctx.strokeStyle = "#ff000055"
    ctx.lineWidth = 1 / engine.scale
    ctx.strokeRect(b.x, b.y, b.width, b.height)
  }

  // =========================
  // HIT TEST
  // =========================
  hitTest(point: { x: number; y: number }, tolerance: number) {
    const dx = this.end.x - this.start.x
    const dy = this.end.y - this.start.y

    const lengthSq = dx * dx + dy * dy
    if (lengthSq === 0) return false

    const t =
      ((point.x - this.start.x) * dx +
        (point.y - this.start.y) * dy) /
      lengthSq

    if (t < 0 || t > 1) return false

    const projX = this.start.x + t * dx
    const projY = this.start.y + t * dy

    const dist = Math.hypot(point.x - projX, point.y - projY)
    return dist <= tolerance
  }

  // =========================
  // HANDLE HIT
  // =========================
  hitHandle(point: { x: number; y: number }, tolerance: number) {
    if (Math.hypot(point.x - this.start.x, point.y - this.start.y) <= tolerance)
      return "start"

    if (Math.hypot(point.x - this.end.x, point.y - this.end.y) <= tolerance)
      return "end"

    return null
  }

  // =========================
  // MOVE
  // =========================
  move(dx: number, dy: number) {
    this.start.x += dx
    this.start.y += dy
    this.end.x += dx
    this.end.y += dy
  }

  getBounds() {
    const minX = Math.min(this.start.x, this.end.x)
    const minY = Math.min(this.start.y, this.end.y)
    const maxX = Math.max(this.start.x, this.end.x)
    const maxY = Math.max(this.start.y, this.end.y)

    return new DOMRect(minX, minY, maxX - minX, maxY - minY)
  }
}// // objects/DistanceObject.ts

// import { CanvasEngine } from "../CanvasEngine"
// import { GraphicObject } from "./GraphicObject"

// export class DistanceObject implements GraphicObject {
//   id = crypto.randomUUID()
//   type = "distance"
//   selected = false

//   constructor(
//     public start: { x: number; y: number },
//     public end: { x: number; y: number }
//   ) {}

//   draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
//     ctx.beginPath()
//     ctx.strokeStyle = this.selected ? "#ff0000" : "#0077ff"
//     ctx.lineWidth = 2 / engine.scale
//     ctx.moveTo(this.start.x, this.start.y)
//     ctx.lineTo(this.end.x, this.end.y)
//     ctx.stroke()

//     if (this.selected) {
//         const size = 6 / engine.scale

//         ctx.fillStyle = "#ffffff"
//         ctx.strokeStyle = "#ff0000"

//         // Start handle
//         ctx.beginPath()
//         ctx.arc(this.start.x, this.start.y, size, 0, Math.PI * 2)
//         ctx.fill()
//         ctx.stroke()

//         // End handle
//         ctx.beginPath()
//         ctx.arc(this.end.x, this.end.y, size, 0, Math.PI * 2)
//         ctx.fill()
//         ctx.stroke()
//     }
//   }

//   hitTest(point: { x: number; y: number }, tolerance: number) {
//     const dx = this.end.x - this.start.x
//     const dy = this.end.y - this.start.y

//     const lengthSquared = dx * dx + dy * dy
//     if (lengthSquared === 0) return false

//     const t =
//       ((point.x - this.start.x) * dx +
//         (point.y - this.start.y) * dy) /
//       lengthSquared

//     if (t < 0 || t > 1) return false

//     const projX = this.start.x + t * dx
//     const projY = this.start.y + t * dy

//     const dist = Math.sqrt(
//       (point.x - projX) ** 2 +
//         (point.y - projY) ** 2
//     )

//     return dist <= tolerance
//   }

//   getBounds() {
//     const minX = Math.min(this.start.x, this.end.x)
//     const minY = Math.min(this.start.y, this.end.y)
//     const maxX = Math.max(this.start.x, this.end.x)
//     const maxY = Math.max(this.start.y, this.end.y)

//     return new DOMRect(minX, minY, maxX - minX, maxY - minY)
//   }
// }