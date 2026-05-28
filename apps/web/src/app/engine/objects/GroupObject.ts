import { CanvasEngine } from "../CanvasEngine";
import { GraphicObject } from "./GraphicObject"

export class GroupObject implements GraphicObject {
  id = crypto.randomUUID()
  type = "group"
  selected = false

  constructor(public children: GraphicObject[]) {}

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    this.children.forEach(c => c.draw(ctx, engine))
  }

  hitTest(point: { x: number; y: number }, tolerance: number) {
    return this.children.some(c => c.hitTest(point, tolerance))
  }

  move(dx: number, dy: number) {
    this.children.forEach(child => {
      child.move(dx, dy)
    })
  }

  getBounds(): DOMRect {
    if (this.children.length === 0) {
        return new DOMRect(0, 0, 0, 0)
    }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const child of this.children) {
        const bounds = child.getBounds()

        minX = Math.min(minX, bounds.x)
        minY = Math.min(minY, bounds.y)
        maxX = Math.max(maxX, bounds.x + bounds.width)
        maxY = Math.max(maxY, bounds.y + bounds.height)
    }

    return new DOMRect(
            minX,
            minY,
            maxX - minX,
            maxY - minY
        )
    }
}