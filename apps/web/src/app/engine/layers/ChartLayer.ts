import { CanvasLayer } from "../types/CanvasLayer"
import { CanvasEngine } from "../CanvasEngine"
import { ChartMetadata } from "@/server/aisweb/types"
// import { ChartMetadata } from "@/lib/navigation/types"

export class ChartLayer implements CanvasLayer {
  id: string
  visible = true
  isUI = false

  private image: HTMLImageElement | null = null

  constructor(
    public chart: ChartMetadata
  ) {
    this.id = `chart-${chart.id}`
  }

  setImage(img: HTMLImageElement) {
    this.image = img
  }

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {
    if (!this.image) return

    const x =
      this.chart.west * 1000

    const y =
      -this.chart.north * 1000

    const width =
      (
        this.chart.east -
        this.chart.west
      ) * 1000

    const height =
      (
        this.chart.north -
        this.chart.south
      ) * 1000

    ctx.drawImage(
      this.image,
      x,
      y,
      width,
      height
    )
  }
}