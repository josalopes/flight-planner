import { CanvasEngine } from "../CanvasEngine";
import { GraphicObject } from "./GraphicObject";

export class LineObject implements GraphicObject {
  id = crypto.randomUUID()
  type = "line"
  selected = true

  constructor(
    public start: { x: number; y: number },
    public end: { x: number; y: number }
  ) {}

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    ctx.beginPath()
    ctx.strokeStyle = this.selected ? "#ff0000" : "#0077ff"
    ctx.lineWidth = 2 / engine.scale
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.stroke()
  }

  hitTest(
    point: { x: number; y: number },
    tolerance: number
  ): boolean {
        const { start, end } = this

        const dx = end.x - start.x
        const dy = end.y - start.y

        const lengthSq = dx * dx + dy * dy

        // Se a linha é apenas um ponto
        if (lengthSq === 0) {
            const dist = Math.hypot(
            point.x - start.x,
            point.y - start.y
            )
            return dist <= tolerance
        }

        // Projeção do ponto na linha
        let t =
            ((point.x - start.x) * dx +
            (point.y - start.y) * dy) /
            lengthSq

        // Limita projeção ao segmento
        t = Math.max(0, Math.min(1, t))

        const projX = start.x + t * dx
        const projY = start.y + t * dy

        const distance = Math.hypot(
            point.x - projX,
            point.y - projY
        )

        return distance <= tolerance
    }

  getBounds() {
    const minX = Math.min(this.start.x, this.end.x)
    const minY = Math.min(this.start.y, this.end.y)
    const maxX = Math.max(this.start.x, this.end.x)
    const maxY = Math.max(this.start.y, this.end.y)

    return new DOMRect(minX, minY, maxX - minX, maxY - minY)
  }
}