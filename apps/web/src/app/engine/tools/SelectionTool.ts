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

// export class SelectionTool implements Tool {
//   id = "select"
//   cursor = "default"

//   private isDragging = false
//   private dragStart: { x: number; y: number } | null = null
//   private dragCurrent: { x: number; y: number } | null = null

//   // =========================
//   // Mouse Down
//   // =========================
//   onMouseDown(engine: CanvasEngine) {
//     const layer = engine.getLayer<ObjectLayer>("objects")
//     if (!layer) return

//     const tolerance = 8 / engine.scale
//     const point = engine.cursor

//     // 1️⃣ Teste de clique em objeto
//     const objects = layer.getAll()

//     let clickedObject: GraphicObject | null = null

//     for (let i = objects.length - 1; i >= 0; i--) {
//       if (objects[i].hitTest(point, tolerance)) {
//         clickedObject = objects[i]
//         break
//       }
//     }

//     // 2️⃣ SHIFT = seleção múltipla
//     if (clickedObject) {
//       if (!engine.isShiftPressed) {
//         objects.forEach(o => (o.selected = false))
//       }

//       clickedObject.selected = !clickedObject.selected
//       engine.render()
//       return
//     }

//     // 3️⃣ Não clicou em nada → iniciar box selection
//     objects.forEach(o => (o.selected = false))

//     this.isDragging = true
//     this.dragStart = { ...point }
//     this.dragCurrent = { ...point }

//     engine.render()
//   }

//   // =========================
//   // Mouse Move
//   // =========================
//   onMouseMove(engine: CanvasEngine) {
//     if (!this.isDragging || !this.dragStart) return

//     this.dragCurrent = { ...engine.cursor }

//     const layer = engine.getLayer<ObjectLayer>("objects")
//     if (!layer) return

//     const selectionRect = this.getSelectionRect()

//     layer.getAll().forEach(obj => {
//       obj.selected = this.contains(
//         selectionRect,
//         obj.getBounds()
//       )
//     })

//     engine.render()
//   }

//   // =========================
//   // Mouse Up
//   // =========================
//   onMouseUp(engine: CanvasEngine) {
//     this.isDragging = false
//     this.dragStart = null
//     this.dragCurrent = null
//     engine.render()
//   }

//   // =========================
//   // Key down
//   // =========================
//   onKeyDown(engine: CanvasEngine, e: KeyboardEvent) {
//     if (e.key === "Delete") {
//       const layer = engine.getLayer<ObjectLayer>("objects")
//       if (!layer) return

//       layer.deleteSelected()
//       engine.render()
//     }
//   }

//   // =========================
//   // Draw Box (chamado pela engine se quiser)
//   // =========================
//   drawOverlay(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
//     if (!this.isDragging || !this.dragStart || !this.dragCurrent)
//       return

//     const rect = this.getSelectionRect()

//     ctx.save()
//     ctx.strokeStyle = "#3399ff"
//     ctx.fillStyle = "rgba(51,153,255,0.2)"
//     ctx.lineWidth = 1 / engine.scale

//     ctx.strokeRect(
//       rect.x,
//       rect.y,
//       rect.width,
//       rect.height
//     )

//     ctx.fillRect(
//       rect.x,
//       rect.y,
//       rect.width,
//       rect.height
//     )

//     ctx.restore()
//   }

//   // =========================
//   // Helpers
//   // =========================

//   private getSelectionRect(): DOMRect {
//     if (!this.dragStart || !this.dragCurrent)
//       return new DOMRect(0, 0, 0, 0)

//     const x = Math.min(this.dragStart.x, this.dragCurrent.x)
//     const y = Math.min(this.dragStart.y, this.dragCurrent.y)
//     const width = Math.abs(this.dragCurrent.x - this.dragStart.x)
//     const height = Math.abs(this.dragCurrent.y - this.dragStart.y)

//     return new DOMRect(x, y, width, height)
//   }

//   private intersects(a: DOMRect, b: DOMRect): boolean {
//     return !(
//       b.x > a.x + a.width ||
//       b.x + b.width < a.x ||
//       b.y > a.y + a.height ||
//       b.y + b.height < a.y
//     )
//   }

//   private contains(a: DOMRect, b: DOMRect): boolean {
//     return (
//       b.x >= a.x &&
//       b.y >= a.y &&
//       b.x + b.width <= a.x + a.width &&
//       b.y + b.height <= a.y + a.height
//     )
//   }
// }