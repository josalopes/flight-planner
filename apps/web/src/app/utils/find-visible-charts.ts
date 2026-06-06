// find-visible-charts.ts
import { CHART_CATALOGUE } from "@/data/chart-catalogue"

export function findVisibleCharts(
  bounds: {
    left: number
    top: number
    right: number
    bottom: number
  }
) {
  return CHART_CATALOGUE.filter(chart => {

    const chartLeft =
      chart.west * 1000

    const chartRight =
      chart.east * 1000

    const chartTop =
      -chart.north * 1000

    const chartBottom =
      -chart.south * 1000

    return !(
      chartRight < bounds.left ||
      chartLeft > bounds.right ||
      chartBottom < bounds.top ||
      chartTop > bounds.bottom
    )
  })
}