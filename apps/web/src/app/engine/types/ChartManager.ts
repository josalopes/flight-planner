import { ChartLayer } from "../layers/ChartLayer"

class ChartManager {

  loaded =
    new Map<string, ChartLayer>()

  async update(engine) {

    const visible =
      getVisibleCharts(
        engine.getVisibleWorldBounds()
      )

    for (const chart of visible) {

      if (this.loaded.has(chart.id))
        continue

      await this.loadChart(
        chart,
        engine
      )
    }
  }
}