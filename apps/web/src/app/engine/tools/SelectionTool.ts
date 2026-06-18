import { CanvasEngine } from "../CanvasEngine"
import { Tool } from "../types/Tool"
import { ObjectLayer } from "../layers/ObjectLayer"
import { GraphicObject } from "../objects/GraphicObject"
import { Point } from "../types/Point"
import { TransformableObject } from "../types/TransformableObject"

function isTransformable(
    obj: GraphicObject
  ): obj is GraphicObject & TransformableObject {
    return "hitHandle" in obj
}

export class SelectionTool implements Tool {
  id = "select"
  cursor = "default"

  private dragging = false
  private dragStart: { x: number; y: number } | null = null
  private draggingObjects: GraphicObject[] = []

  

  onMouseDown(engine: CanvasEngine) {
    const layer = engine.getLayer<ObjectLayer>("objects")
    if (!layer) return

    const tolerance = 8 / engine.scale
    const point = engine.cursor

    const objects = layer.getAll()

    // Check handles first
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i]
      if (isTransformable(obj) && obj.selected) {
        const handle = obj.hitHandle(point, tolerance)
        if (handle) {
          this.dragging = true
          this.draggingObjects = [obj]
          return
        }
      }
    }

    // Check body
    for (let i = objects.length - 1; i >= 0; i--) {
      if (objects[i].hitTest(point, tolerance)) {
        if (!engine.isShiftPressed) {
          layer.clearSelection()
        }

        objects[i].selected = true
        this.dragging = true
        this.draggingObjects = layer.getAll().filter(o => o.selected)
        engine.render()
        return
      }
    }

    // Box selection
    layer.clearSelection()
    this.dragging = true
    this.dragStart = { ...point }
  }

  onMouseMove(engine: CanvasEngine) {
    if (!this.dragging) return

    const layer = engine.getLayer<ObjectLayer>("objects")
    if (!layer) return

    const point = engine.cursor

    if (this.dragStart) {
      const rect = this.getRect(this.dragStart, point)

      layer.getAll().forEach(obj => {
        obj.selected = this.intersects(rect, obj.getBounds())
      })
    } else {
      const dx = engine.cursor.x - engine.previousCursor.x
      const dy = engine.cursor.y - engine.previousCursor.y

      const snapped = engine.getSnappedDelta(dx, dy)

      this.draggingObjects.forEach(obj => {
        obj.move(snapped.dx, snapped.dy)
      })
    }

    engine.render()
  }

  onMouseUp(engine: CanvasEngine) {
    this.dragging = false
    this.dragStart = null
        this.dragStart = null
    // this.dragCurrent = null
    engine.render()
  }

  private getRect(a: Point, b: Point): DOMRect {
    const x = Math.min(a.x, b.x)
    const y = Math.min(a.y, b.y)
    const w = Math.abs(a.x - b.x)
    const h = Math.abs(a.y - b.y)

    return new DOMRect(x, y, w, h)
  }

  private intersects(a: DOMRect, b: DOMRect) {
    return !(
      b.x > a.x + a.width ||
      b.x + b.width < a.x ||
      b.y > a.y + a.height ||
      b.y + b.height < a.y
    )
  }
}
