import { CanvasLayer } from "../types/CanvasLayer"
import { CanvasEngine } from "../CanvasEngine"
import { Measurement } from "../types/Measurement"

export class DistanceLayer implements CanvasLayer {
  id = "distance"
  visible = true
  isUI = false

  private measurements: Measurement[] = []
  private preview: Measurement | null = null

  private distanceToSegment(
    p: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) {
    const dx = b.x - a.x
    const dy = b.y - a.y

    const lengthSq = dx * dx + dy * dy
    if (lengthSq === 0) return Math.hypot(p.x - a.x, p.y - a.y)

    let t =
      ((p.x - a.x) * dx + (p.y - a.y) * dy) /
      lengthSq

    t = Math.max(0, Math.min(1, t))

    const projX = a.x + t * dx
    const projY = a.y + t * dy

    return Math.hypot(p.x - projX, p.y - projY)
  }

  // =========================
  // API pública
  // =========================

  public getPreview() {
    return this.preview
  }

  startMeasurement(point: { x: number; y: number }) {
    this.preview = {
      id: crypto.randomUUID(),
      start: point,
      end: point
    }
  }

  selectAt(point: { x: number; y: number }, tolerance: number) {
    this.measurements.forEach(m => (m.selected = false))

    for (const m of this.measurements) {
      const dist = this.distanceToSegment(point, m.start, m.end)

      if (dist < tolerance) {
        m.selected = true
        return m
      }
    }

    return null
  }

  updatePreview(point: { x: number; y: number }) {
    if (!this.preview) return
    this.preview.end = point
  }

  finishMeasurement() {
    if (!this.preview) return
    this.measurements.push(this.preview)
    this.preview = null
  }

  clearSelection() {
    this.measurements.forEach(m => (m.selected = false))
  }

  selectMeasurement(id: string) {
    this.clearSelection()
    const m = this.measurements.find(m => m.id === id)
    if (m) m.selected = true
  }

  getMeasurements() {
    return this.measurements
  }

  deleteSelected() {
    this.measurements = this.measurements.filter(
      m => !m.selected
    )
  }

  exportJSON() {
    return JSON.stringify(this.measurements, null, 2)
  }

  hitTest(point: { x: number; y: number }, tolerance: number) {
    for (const m of this.measurements) {
      const distStart = Math.hypot(
        m.start.x - point.x,
        m.start.y - point.y
      )

      const distEnd = Math.hypot(
        m.end.x - point.x,
        m.end.y - point.y
      )

      if (distStart < tolerance)
        return { measurement: m, handle: "start" }

      if (distEnd < tolerance)
        return { measurement: m, handle: "end" }
    }

    return null
  }

  // =========================
  // DRAW
  // =========================

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    const drawOne = (m: Measurement, isPreview = false) => {
      const { start, end, selected } = m

      const dx = end.x - start.x
      const dy = end.y - start.y

      const distance = Math.sqrt(dx * dx + dy * dy)
      const angleRad = Math.atan2(dy, dx)
      const angleDeg = (angleRad * 180) / Math.PI

      const midX = start.x + dx / 2
      const midY = start.y + dy / 2

      ctx.save()

      ctx.lineWidth = 2 / engine.scale
      ctx.strokeStyle = selected ? "#ff0000" : "#0077ff"

      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()

      // Pontos
      ctx.fillStyle = ctx.strokeStyle
      ctx.beginPath()
      ctx.arc(start.x, start.y, 4 / engine.scale, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(end.x, end.y, 4 / engine.scale, 0, Math.PI * 2)
      ctx.fill()

      // Texto
      ctx.fillStyle = "#000"
      ctx.font = `${12 / engine.scale}px Arial`

      const unitDistance = engine.worldToUnit(distance).toFixed(2)
      const unitDX = engine.worldToUnit(dx).toFixed(2)
      const unitDY = engine.worldToUnit(dy).toFixed(2)

      ctx.fillText(
        `D: ${unitDistance}`,
        midX,
        midY - 20 / engine.scale
      )

      ctx.fillText(
        `ΔX: ${unitDX}`,
        midX,
        midY
      )

      ctx.fillText(
        `ΔY: ${unitDY}`,
        midX,
        midY + 20 / engine.scale
      )

      ctx.fillText(
        `θ: ${angleDeg.toFixed(1)}°`,
        midX,
        midY + 40 / engine.scale
      )

      ctx.restore()
    }

    // Desenhar todas
    this.measurements.forEach(m => drawOne(m))

    // Preview
    if (this.preview) {
      drawOne(this.preview, true)
    }
  }
}

