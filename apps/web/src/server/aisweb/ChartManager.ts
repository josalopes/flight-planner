import { CanvasEngine } from "@/app/engine/CanvasEngine"
import { expandBounds } from "./types"
import { findVisibleCharts } from "@/app/utils/find-visible-charts"
import { ChartLayer } from "@/app/engine/layers/ChartLayer"
import { loadChart } from "./load-chart"

export class ChartManager {

  private imageCache =
    new Map<
      string,
      HTMLImageElement
    >()
    private loading = false

  async update(
  engine: CanvasEngine
) {

  if (this.loading)
    return

  this.loading = true

  try {

    const bounds =
      expandBounds(
        engine.getVisibleWorldBounds(),
        5000
      )

    const charts =
      findVisibleCharts(bounds)

    for (const chart of charts) {

      const layerId =
        `chart-${chart.id}`

      if (
        engine.getLayer(layerId)
      ) {
        continue
      }

      const layer =
        new ChartLayer(chart)

      engine.addLayerAt(0, layer)

      let image =
        this.imageCache.get(chart.id)

      if (!image) {

        image =
          await loadChart(chart)

        this.imageCache.set(
          chart.id,
          image
        )
      }

      layer.setImage(image)
    }

    engine.render()

  } finally {

    this.loading = false

  }
}
}