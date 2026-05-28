import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"

export type RulerUnit = "px" | "cm" | "mm" | "in"

export class RulerLayer implements CanvasLayer {
  id = "ruler"
  visible = true
  isUI = true

  private thickness = 30

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    if (!this.visible) return

    const canvas = engine.getCanvas()
    const { scale, offset, dpi, unit } = engine

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // Fundo
    ctx.fillStyle = "#f3f3f3"
    ctx.fillRect(0, 0, canvas.width, this.thickness)
    ctx.fillRect(0, 0, this.thickness, canvas.height)

    ctx.strokeStyle = "#000"
    ctx.fillStyle = "#000"
    ctx.lineWidth = 1
    ctx.font = "10px Arial"

    // ==============================
    // Conversão base (pixel → unidade)
    // ==============================

    let pixelsPerUnit = 1

    switch (unit) {
      case "cm":
        pixelsPerUnit = dpi / 2.54
        break
      case "mm":
        pixelsPerUnit = dpi / 25.4
        break
      case "in":
        pixelsPerUnit = dpi
        break
      case "px":
      default:
        // pixelsPerUnit = 1
    }

    
        
        // ==============================
        // RANGE VISÍVEL
        // ==============================
        
    const { minorStep, majorEvery } = engine.getAdaptiveSteps()

    const startWorldX = (-offset.x - engine.rulerSize) / scale
    const endWorldX = (canvas.width - offset.x - engine.rulerSize) / scale

    const startWorldY = (-offset.y - engine.rulerSize) / scale
    const endWorldY = (canvas.height - offset.y - engine.rulerSize) / scale

    // ==============================
    // HORIZONTAL
    // ==============================

    const firstIndexX = Math.ceil(startWorldX / minorStep)

    for (let i = firstIndexX; ; i++) {
        const worldX = i * minorStep
        if (worldX > endWorldX) break

        const screenX = worldX * scale + offset.x + engine.rulerSize
        if (screenX < 0) continue
        if (screenX > canvas.width) break

        const isMajor = i % majorEvery === 0

        const x = Math.round(screenX) + 0.5
        const size = isMajor ? 14 : 6

        ctx.beginPath()
        ctx.moveTo(x, this.thickness)
        ctx.lineTo(x, this.thickness - size)
        ctx.stroke()

        if (isMajor) {
            const label = engine.worldToUnit(worldX).toFixed(0)
            const textWidth = ctx.measureText(label).width
            ctx.fillText(label, x - textWidth / 2, 10)
        }
    }

    // ==============================
    // VERTICAL
    // ==============================

    const firstIndexY = Math.ceil(startWorldY / minorStep)

    for (let i = firstIndexY; ; i++) {
        const worldY = i * minorStep
        if (worldY > endWorldY) break

        const screenY = worldY * scale + offset.y + engine.rulerSize
        if (screenY < 0) continue
        if (screenY > canvas.height) break

        const isMajor = i % majorEvery === 0

        const y = Math.round(screenY) + 0.5
        const size = isMajor ? 14 : 6

        ctx.beginPath()
        ctx.moveTo(this.thickness, y)
        ctx.lineTo(this.thickness - size, y)
        ctx.stroke()

        if (isMajor) {
            const label = engine.worldToUnit(worldY).toFixed(0)
            const textWidth = ctx.measureText(label).width

            ctx.save()
            ctx.translate(8, y + 3)
            ctx.rotate(-Math.PI / 2)
            ctx.fillText(label, -textWidth / 2, 0)
            ctx.restore()
        }
    }

    ctx.restore()
  }
}
