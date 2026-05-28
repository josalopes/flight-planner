export interface Point {
  x: number
  y: number
}

interface EngineState {
  scale: number
  offset: Point
  cursor: Point
}

export class GridWorkspace {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement

  state: EngineState = {
    scale: 1,
    offset: { x: 0, y: 0 },
    cursor: { x: 0, y: 0 }
  }

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Canvas 2D context not available")

    this.ctx = context
    this.canvas = canvas
  }

  /* ============================= */
  /* ======== STATE API ========= */
  /* ============================= */

  setCursor(x: number, y: number) {
    this.state.cursor = { x, y }
  }

  setScale(scale: number) {
    this.state.scale = Math.max(0.1, Math.min(10, scale))
  }

  pan(dx: number, dy: number) {
    this.state.offset.x += dx
    this.state.offset.y += dy
  }

  zoom(direction: number, mouseX?: number, mouseY?: number) {
    const zoomFactor = 0.1

    const oldScale = this.state.scale
    const newScale =
      oldScale + direction * zoomFactor * oldScale

    const clampedScale = Math.max(0.1, Math.min(10, newScale))

    if (mouseX !== undefined && mouseY !== undefined) {
      // Zoom centrado no cursor
      const worldX =
        (mouseX - this.state.offset.x) / oldScale
      const worldY =
        (mouseY - this.state.offset.y) / oldScale

      this.state.scale = clampedScale

      this.state.offset.x =
        mouseX - worldX * clampedScale
      this.state.offset.y =
        mouseY - worldY * clampedScale
    } else {
      this.state.scale = clampedScale
    }
  }

  /* ============================= */
  /* ========= RENDER =========== */
  /* ============================= */

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
  }

  render() {
    this.clear()
    this.drawGrid()
  }

  /* ============================= */
  /* ========= GRID ============= */
  /* ============================= */

  private drawGrid() {
    const { ctx, canvas } = this

    const gridSize = 50
    const scaledGridSize = gridSize * this.state.scale

    const startX =
      -this.state.offset.x % scaledGridSize
    const startY =
      -this.state.offset.y % scaledGridSize

    ctx.save()

    ctx.lineWidth = 1
    ctx.strokeStyle = "#e5e5e5"

    // Linhas verticais
    for (
      let x = startX;
      x < canvas.width;
      x += scaledGridSize
    ) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Linhas horizontais
    for (
      let y = startY;
      y < canvas.height;
      y += scaledGridSize
    ) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    ctx.restore()
  }
}