// tools/PanTool.ts

import { CanvasEngine } from "../CanvasEngine"
import { Tool } from "../types/Tool"

export class PanTool implements Tool{
  id = "pan"
  cursor = "default"

  private isDragging = false
  private lastPos = { x: 0, y: 0 }

  onMouseDown(engine: CanvasEngine, e: MouseEvent) {
    this.isDragging = true
    this.lastPos = { x: e.clientX, y: e.clientY }
  }

  async onMouseMove(engine: CanvasEngine, e: MouseEvent) {
    if (!this.isDragging) return

    const dx = e.clientX - this.lastPos.x
    const dy = e.clientY - this.lastPos.y

    engine.offset.x += dx
    engine.offset.y += dy

    this.lastPos = { x: e.clientX, y: e.clientY }

    engine.render()

  }
  
  async onMouseUp(engine: CanvasEngine) {
    this.isDragging = false
    await engine.chartManager.update(engine)
  }
}