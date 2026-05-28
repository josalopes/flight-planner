import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"

export class CrosshairLayer implements CanvasLayer {
  id = "crosshair"
  visible = true
  isUI = true

  color = "red"

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    if (!this.visible) return

    const canvas = engine.getCanvas()
    const { scale, offset, cursor, rulerSize } = engine

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    const screenX =
      cursor.x * scale + offset.x + rulerSize

    const screenY =
      cursor.y * scale + offset.y + rulerSize

    // =========================
    // LINHAS
    // =========================

    ctx.strokeStyle = this.color
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(rulerSize, screenY)
    ctx.lineTo(canvas.width, screenY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(screenX, rulerSize)
    ctx.lineTo(screenX, canvas.height)
    ctx.stroke()

    // =========================
    // VALORES NAS RÉGUAS
    // =========================

    const unitX = engine.worldToUnit(cursor.x)
    const unitY = engine.worldToUnit(cursor.y)

    ctx.fillStyle = this.color
    ctx.font = "10px Arial"

    // Valor X → na régua superior
    const textX = unitX.toFixed(1)
    const widthX = ctx.measureText(textX).width

    const minX = engine.rulerSize + 4
    const maxX = canvas.width - 4

    let drawX = screenX - widthX / 2
    drawX = Math.max(minX, Math.min(drawX, maxX - widthX))

    ctx.fillText(textX, drawX, 12)

    // Valor Y → na régua esquerda
    const textY = unitY.toFixed(1)

    const minY = engine.rulerSize + 4
    const maxY = canvas.height - 4

    let drawY = screenY

    drawY = Math.max(minY, Math.min(drawY, maxY))

    ctx.save()
    ctx.translate(12, drawY)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(textY, 0, 0)
    ctx.restore()

  }
}

