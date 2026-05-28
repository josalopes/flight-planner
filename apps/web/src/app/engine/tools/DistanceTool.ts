import { CanvasEngine } from "../CanvasEngine"
import { ObjectLayer } from "../layers/ObjectLayer"
import { DistanceObject } from "../objects/DistanceObject"
import { Measurement } from "../types/Measurement"
import { Tool } from "../types/Tool"

export class DistanceTool implements Tool{
  id = "distance"
  cursor = "crosshair"

  private isMeasuring = false
  private startPoint: { x: number; y: number } | null = null

  private draggingHandle:
  | { m: Measurement; handle: "start" | "end" }
  | null = null

  drawOverlay(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    if (!this.isMeasuring || !this.startPoint) return

    let endPoint = { ...engine.cursor }

    // SHIFT constraint
    if (engine.isShiftPressed) {
      const dx = endPoint.x - this.startPoint.x
      const dy = endPoint.y - this.startPoint.y

      const angle = Math.atan2(dy, dx)
      const snappedAngle =
        Math.round(angle / (Math.PI / 4)) * (Math.PI / 4)

      const length = Math.sqrt(dx * dx + dy * dy)

      endPoint = {
        x: this.startPoint.x + Math.cos(snappedAngle) * length,
        y: this.startPoint.y + Math.sin(snappedAngle) * length
      }
    }

    ctx.save()

    ctx.setTransform(
      engine.scale,
      0,
      0,
      engine.scale,
      engine.offset.x + engine.rulerSize,
      engine.offset.y + engine.rulerSize
    )

    ctx.strokeStyle = "#0077ff"
    ctx.lineWidth = 2 / engine.scale

    ctx.beginPath()
    ctx.moveTo(this.startPoint.x, this.startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()

    ctx.restore()
  }


  onMouseDown(engine: CanvasEngine) {
    const layer = engine.getLayer<ObjectLayer>("objects")
    if (!layer) return

    // PRIMEIRO CLIQUE
    if (!this.isMeasuring) {
      this.startPoint = { ...engine.cursor }
      this.isMeasuring = true
      return
    }

    // SEGUNDO CLIQUE
    if (!this.startPoint) return

    const distanceObj = new DistanceObject(
      this.startPoint,
      { ...engine.cursor }
    )

    layer.add(distanceObj)

    this.startPoint = null
    this.isMeasuring = false

    engine.render()
  }

  onMouseMove(engine: CanvasEngine) {
    const layer = engine.getLayer<ObjectLayer>("objects")
    if (!layer) return

    // =========================
    // DRAG HANDLE
    // =========================
    if (this.draggingHandle) {
      const { m, handle } = this.draggingHandle
      m[handle] = { ...engine.cursor }
      engine.render()
      return
    }

    // =========================
    // MEDIÇÃO EM ANDAMENTO
    // =========================
    if (!this.isMeasuring || !this.startPoint) return

    let endPoint = { ...engine.cursor }

    // SHIFT constraint
    if (engine.isShiftPressed) {
      const dx = endPoint.x - this.startPoint.x
      const dy = endPoint.y - this.startPoint.y

      const angle = Math.atan2(dy, dx)
      const snappedAngle =
        Math.round(angle / (Math.PI / 4)) * (Math.PI / 4)

      const length = Math.sqrt(dx * dx + dy * dy)

      endPoint = {
        x: this.startPoint.x + Math.cos(snappedAngle) * length,
        y: this.startPoint.y + Math.sin(snappedAngle) * length
      }
    }

    // redraw preview
    engine.render()
  }
  
  onMouseUp = () => {
    this.draggingHandle = null
  }

  onKeyDown(engine: CanvasEngine, e: KeyboardEvent) {
    const layer = engine.getLayer<ObjectLayer>("objects")

    if (!layer) return

    if (e.key === "Escape") {
      this.isMeasuring = false
      this.startPoint = null
      engine.render()
    }

    if (e.key === "Delete") {
      layer.deleteSelected()
      engine.render()
    }
  }

}

