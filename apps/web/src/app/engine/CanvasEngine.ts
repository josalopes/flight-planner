import { CanvasLayer } from "./types/CanvasLayer"
import { ImageLayer } from "./layers/ImageLayer"
import { GridLayer } from "./layers/GridLayer"
import { DistanceLayer } from "./layers/DistanceLayer"
import { Tool } from "./types/Tool"
import jsPDF from "jspdf"
import { ChartMetadata } from "@/server/aisweb/types"
import { latLonToPixel } from "../utils/latlon-to-pixel"
import { ChartManager } from "@/server/aisweb/ChartManager"

export type ToolType =
  | "pan"
  | "distance"
  | "draw"
  | "selection"

interface Command {
  execute(): void
  undo(): void
}  

export class CanvasEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private layers: CanvasLayer[] = []
  private isDragging = false
  private lastPos = { x: 0, y: 0 }
  private tools = new Map<string, Tool>()
  private activeTool: Tool | null = null
  private previousTool: Tool | null = null
  private undoStack: Command[] = []
  private redoStack: Command[] = []
  
  public chartManager = new ChartManager()
  public scale = 1
  public offset = { x: 0, y: 0 }
  public cursor = { x: 0, y: 0 }
  public dpi = 96
  public unit: "px" | "cm" | "mm" | "in" = "cm"
  public snapEnabled = true
  public snapTolerancePx = 8
  public isShiftPressed = false
  public previousCursor = { x:0, y:0 }

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas 2D not supported")

    this.canvas = canvas
    this.ctx = ctx

    this.attachEvents()
    this.attachKeyboard()
  }

  public executeCommand(command: Command) {
    command.execute()
    this.undoStack.push(command)
    this.redoStack = []
    this.render()
  }

  public undo() {
    const command = this.undoStack.pop()
    if (!command) return

    command.undo()
    this.redoStack.push(command)
    this.render()
  }

  public redo() {
    const command = this.redoStack.pop()
    if (!command) return

    command.execute()
    this.undoStack.push(command)
    this.render()
  }

  public getSnappedDelta(dx: number, dy: number) {
    if (!this.snapEnabled) return { dx, dy }

    const grid = this.getLayer<GridLayer>("grid")
    if (!grid) return { dx, dy }

    const step = this.getPixelsPerUnit() * grid.spacingUnits

    return {
      dx: Math.round(dx / step) * step,
      dy: Math.round(dy / step) * step
    }
  }

  public getActiveToolId(): string | null {
    return this.activeTool?.id ?? null
  }

  public getTools() {
    return Array.from(this.tools.values())
  }

  private updateCursorStyle() {
    if (!this.activeTool) return

    this.canvas.style.cursor =
      this.activeTool.cursor ?? "default"
  }

  public getSnappedPoint(point: { x: number; y: number }) {
    if (!this.snapEnabled) return point

    const grid = this.getLayer<GridLayer>("grid")
    if (!grid) return point

    const pixelsPerUnit = this.getPixelsPerUnit()
    const step = pixelsPerUnit * grid.spacingUnits

    const snapX = Math.round(point.x / step) * step
    const snapY = Math.round(point.y / step) * step

    const dx = Math.abs(point.x - snapX)
    const dy = Math.abs(point.y - snapY)

    const tolerance = this.snapTolerancePx / this.scale

    return {
      x: dx < tolerance ? snapX : point.x,
      y: dy < tolerance ? snapY : point.y
    }
  }

  public exportMeasurements() {
    const layer = this.getLayer<DistanceLayer>("distance")
    return layer?.exportJSON()
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Shift") this.isShiftPressed = true

    const key = e.key.toLowerCase()

    if (key === "v") {
      this.setTool("select")
    }

    if (key === "d") {
      this.setTool("distance")
    }
    
    if (key === "h") {
      this.setTool("pan")
    }

    if (e.code === "Space") {
      if (this.activeTool?.id !== "pan") {
        this.previousTool = this.activeTool
        this.setTool("pan")
      }
    }
    this.activeTool?.onKeyDown?.(this, e)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Shift") this.isShiftPressed = false

    if (e.code === "Space") {
      if (this.previousTool) {
        this.activeTool = this.previousTool
        this.previousTool = null
        this.updateCursorStyle()
      }
    }

    this.activeTool?.onKeyUp?.(this, e)
  }

  private attachKeyboard() {
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
  }

  public registerTool(tool: Tool) {
    this.tools.set(tool.id, tool)
  }

  public setTool(id: string) {
    this.activeTool = this.tools.get(id) ?? null
    this.updateCursorStyle()
  }

  public getPixelsPerUnit() {
    switch (this.unit) {
      case "cm":
        return this.dpi / 2.54
      case "mm":
        return this.dpi / 25.4
      case "in":
        return this.dpi
      case "px":
      default:
        return 1
    }
  }

  public getAdaptiveSteps() {
    const pixelsPerUnit = this.getPixelsPerUnit()

    let minorStep = pixelsPerUnit
    let majorEvery = 10

    let screenStep = minorStep * this.scale

    if (screenStep < 8) {
      minorStep *= 5
      majorEvery = 5
      screenStep = minorStep * this.scale
    }

    if (screenStep < 8) {
      minorStep *= 2
      majorEvery = 2
    }

    return {
      minorStep,
      majorEvery
    }
  }

  public unitToWorld(value: number) {
    switch (this.unit) {
      case "cm":
        return (value / 2.54) * this.dpi
      case "mm":
        return (value / 25.4) * this.dpi
      case "in":
        return value * this.dpi
      case "px":
      default:
        return value
    }
  }

  public worldToUnit(value: number) {
    switch (this.unit) {
      case "cm":
        return (value / this.dpi) * 2.54
      case "mm":
        return (value / this.dpi) * 25.4
      case "in":
        return value / this.dpi
      case "px":
      default:
        return value
    }
  }

  public centerAt(
    x: number,
    y: number,
    zoom = this.scale
  ) {
    this.scale = zoom

    const canvas = this.getCanvas()

    this.offset.x =
      canvas.width / 2 -
      x * zoom

    this.offset.y =
      canvas.height / 2 -
      y * zoom

    this.render()
  }

  public centerAtLatLon(
    lat: number,
    lon: number,
    chart: ChartMetadata,
    zoom = this.scale
  ) {
    const point =
      latLonToPixel(
        lat,
        lon,
        chart
      )

    this.centerAt(
      point.x,
      point.y,
      zoom
    )
  }

  addLayerAt(
    index: number,
    layer: CanvasLayer
  ) {
    this.layers.splice(
      index,
      0,
      layer
    )
  }

  public fitRoute(
    start: { x: number; y: number },
    end: { x: number; y: number },
    padding = 100
  ) {
    const canvas = this.getCanvas()

    const minX = Math.min(start.x, end.x)
    const maxX = Math.max(start.x, end.x)

    const minY = Math.min(start.y, end.y)
    const maxY = Math.max(start.y, end.y)

    const routeWidth =
      Math.max(
        100,
        maxX - minX
      )

    const routeHeight =
      Math.max(
        100,
        maxY - minY
      )

    const zoomX =
      (canvas.width - padding * 2)
      /
      routeWidth

    const zoomY =
      (canvas.height - padding * 2)
      /
      routeHeight

    const zoom =
      Math.min(0.8,
        zoomX,
        zoomY
      )

    const centerX =
      (minX + maxX) / 2

    const centerY =
      (minY + maxY) / 2

    this.centerAt(
      centerX,
      centerY,
      zoom
    )
  }

  public getVisibleWorldBounds() {
    const canvas =
      this.getCanvas()

    const left =
      -this.offset.x / this.scale

    const top =
      -this.offset.y / this.scale

    const right =
      left +
      canvas.width / this.scale

    const bottom =
      top +
      canvas.height / this.scale

    return {
      left,
      top,
      right,
      bottom
    }
  }

  // =========================
  // Public getters
  // =========================

  public getCanvas() {
    return this.canvas
  }

  // =========================
  // CLEAR
  // =========================

    public clear = () => {
        this.scale = 1
        this.offset = { x: 0, y: 0 }

        const imageLayer = this.getLayer<ImageLayer>("image")
        imageLayer?.setImage(null)

        this.canvas.width = 1920
        this.canvas.height = 1080

        this.render()
    }

    // =========================
    // EXPORT PNG
    // =========================

    public exportPNG = (filename = "canvas.png") => {
        // renderiza temporariamente sem HUD e Ruler
        this.render({ exclude: ["hud", "ruler", "distance"] })
        const link = document.createElement("a")
        link.download = filename
        link.href = this.canvas.toDataURL("image/png")
        link.click()
    }

    // =========================
    // EXPORT PDF
    // =========================

    public exportPDF = (paperSize: string, orientation: "portrait" | "landscape") => {
        const pdf = new jsPDF({
            orientation,
            unit: "mm",
            format: paperSize
        })

        // renderiza temporariamente sem HUD e Ruler
        this.render({ exclude: ["hud", "ruler", "distance"] })
        const imgData = this.canvas.toDataURL("image/png", 1.0)

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        const canvasWidth = this.canvas.width
        const canvasHeight = this.canvas.height

        const ratio = Math.min(
            pageWidth / canvasWidth,
            pageHeight / canvasHeight
        )

        const imgWidth = canvasWidth * ratio
        const imgHeight = canvasHeight * ratio

        const x = (pageWidth - imgWidth) / 2
        const y = (pageHeight - imgHeight) / 2

        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
        pdf.save("grid.pdf")
    }

  // =========================
  // Layer Management
  // =========================

  removeLayersByPrefix(prefix: string) {
    this.layers =
      this.layers.filter(
        layer =>
          !layer.id.startsWith(prefix)
    )

    this.render()
  }

  removeLayer(id: string) {
    this.layers =
      this.layers.filter(
        layer => layer.id !== id
    )
  }

  addLayer(layer: CanvasLayer) {
    this.layers.push(layer)
  }

  getLayer<T extends CanvasLayer>(id: string): T | undefined {
    return this.layers.find(l => l.id === id) as T | undefined
  }

  // =========================
  // Zoom + Pan
  // =========================

  private attachEvents() {
    this.canvas.addEventListener("mousedown", this.onMouseDown)
    this.canvas.addEventListener("mousemove", this.onMouseMove)
    this.canvas.addEventListener("mouseup", this.onMouseUp)
    this.canvas.addEventListener("mouseleave", this.onMouseUp)
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false })
  }  

  private onMouseDown = (e: MouseEvent) => {
    if (this.activeTool?.onMouseDown) {
      this.activeTool.onMouseDown(this, e)
      return
    }

    // fallback pan
    this.isDragging = true
    this.lastPos = { x: e.clientX, y: e.clientY }
  }

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect()

    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height

    const screenX = (e.clientX - rect.left) * scaleX
    const screenY = (e.clientY - rect.top) * scaleY

    this.previousCursor = { ...this.cursor }

    // atualizar cursor SEMPRE
    this.cursor.x = (screenX - this.offset.x) / this.scale
    this.cursor.y = (screenY - this.offset.y) / this.scale

    // ferramenta tem prioridade
    if (this.activeTool?.onMouseMove) {
      this.activeTool.onMouseMove(this, e)
    }

    // pan só se for pan tool
    if (this.isDragging && this.activeTool?.id === "pan") {
      const dx = e.clientX - this.lastPos.x
      const dy = e.clientY - this.lastPos.y

      this.offset.x += dx
      this.offset.y += dy

      this.lastPos = { x: e.clientX, y: e.clientY }
    }

    this.render()

  }

  private onMouseUp = (e: MouseEvent) => {
    this.activeTool?.onMouseUp?.(this, e)
    this.isDragging = false
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()

    const zoomFactor = 0.1
    const direction = e.deltaY > 0 ? -1 : 1

    const newScale = this.scale + direction * zoomFactor * this.scale
    this.scale = Math.max(0.1, Math.min(10, newScale))

    this.render()
  }

  // =========================
  // Render
  // =========================

  render(options?: { exclude?: string[] }) {
    const { ctx, canvas } = this
    const excluded = options?.exclude ?? []

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // =========================
    // WORLD SPACE
    // =========================

    ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.offset.x,
      this.offset.y
    )

    for (const layer of this.layers) {
      if (layer.visible === false) continue
      if (layer.isUI) continue
      if (excluded.includes(layer.id)) continue
      layer.draw(ctx, this)
    }

    // =========================
    // SCREEN SPACE (UI)
    // =========================

    ctx.setTransform(1, 0, 0, 1, 0, 0)

    for (const layer of this.layers) {
      if (layer.visible === false) continue
      if (!layer.isUI) continue
      if (excluded.includes(layer.id)) continue
      layer.draw(ctx, this)
    }

    if (
        this.activeTool &&
        "drawOverlay" in this.activeTool &&
        typeof this.activeTool.drawOverlay === "function"
      ) {
        this.activeTool.drawOverlay(this.ctx, this)
      }    
  }
}
