import { CanvasEngine } from "../CanvasEngine"
import { CanvasLayer } from "../types/CanvasLayer"

export class GridLayer implements CanvasLayer {
  id = "grid"
  visible = true
  isUI = false

  thickness: number
  color: string

  showMainGrid: boolean = true
  showSubdivisions: boolean = true

  // 🔥 espaçamento em UNIDADES (cm/mm/etc)
  spacingUnits: number = 1

  constructor(color: string, thickness: number) {
    this.color = color
    this.thickness = thickness
  }

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    const canvas = engine.getCanvas()
    const { scale, offset } = engine

    const width = canvas.width
    const height = canvas.height

    const pixelsPerUnit = engine.getPixelsPerUnit()

    const mainStep = pixelsPerUnit * this.spacingUnits
    const subStep = mainStep / 10

    const startWorldX = (-offset.x - engine.rulerSize) / scale
    const endWorldX = (width - offset.x - engine.rulerSize) / scale
    const startWorldY = (-offset.y - engine.rulerSize) / scale
    const endWorldY = (height - offset.y - engine.rulerSize) / scale

    // =========================
    // SUBDIVISÕES
    // =========================
    if (this.showSubdivisions) {
      const firstX = Math.floor(startWorldX / subStep)

      for (let i = firstX; ; i++) {
        const worldX = i * subStep
        if (worldX > endWorldX) break

        // const screenX = worldX * scale + offset.x + engine.rulerSize
        const alignedX = worldX
        // const alignedX = Math.round(screenX) + 0.5
        const alignedWorldX = (alignedX - offset.x - engine.rulerSize) / scale

        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = this.color + "55"
        ctx.moveTo(worldX, startWorldY)
        ctx.lineTo(worldX, endWorldY)
        ctx.stroke()
      }

      const firstY = Math.floor(startWorldY / subStep)

      for (let i = firstY; ; i++) {
        const worldY = i * subStep
        if (worldY > endWorldY) break

        // const screenY = worldY * scale + offset.y + engine.rulerSize
        const alignedY = worldY
        // const alignedY = Math.round(screenY) + 0.5
        // const alignedWorldY = (alignedY - offset.y - engine.rulerSize) / scale

        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = this.color + "55"
        ctx.moveTo(startWorldX, worldY)
        ctx.lineTo(endWorldX, worldY)
        ctx.stroke()
      }
    }

    // =========================
    // GRID PRINCIPAL
    // =========================
    if (this.showMainGrid) {
      const firstX = Math.floor(startWorldX / mainStep)

      for (let i = firstX; ; i++) {
        const worldX = i * mainStep
        if (worldX > endWorldX) break

        const screenX = worldX * scale + offset.x
        const alignedX = Math.round(screenX) + 0.5
        const alignedWorldX = (alignedX - offset.x) / scale

        ctx.beginPath()
        ctx.lineWidth = this.thickness / scale
        ctx.strokeStyle = this.color
        ctx.moveTo(alignedWorldX, startWorldY)
        ctx.lineTo(alignedWorldX, endWorldY)
        ctx.stroke()
      }

      const firstY = Math.floor(startWorldY / mainStep)

      for (let i = firstY; ; i++) {
        const worldY = i * mainStep
        if (worldY > endWorldY) break

        const screenY = worldY * scale + offset.y
        const alignedY = Math.round(screenY) + 0.5
        const alignedWorldY = (alignedY - offset.y) / scale

        ctx.beginPath()
        ctx.lineWidth = this.thickness / scale
        ctx.strokeStyle = this.color
        ctx.moveTo(startWorldX, alignedWorldY)
        ctx.lineTo(endWorldX, alignedWorldY)
        ctx.stroke()
      }
    }
  }
}
