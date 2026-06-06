import { ChartMetadata } from "@/server/aisweb/types"
import { CHART_CATALOGUE } from "@/data/chart-catalogue"
// import { CHART_CATALOGUE } from "@/data/chart-catalogue"

interface Point {
  x: number
  y: number
}

export function findChartsAlongRoute(
  start: Point,
  end: Point
): ChartMetadata[] {

  const routeLeft =
    Math.min(start.x, end.x)

  const routeRight =
    Math.max(start.x, end.x)

  const routeTop =
    Math.min(start.y, end.y)

  const routeBottom =
    Math.max(start.y, end.y)

  return CHART_CATALOGUE.filter(chart => {

    const chartLeft =
      chart.west * 1000

    const chartRight =
      chart.east * 1000

    const chartTop =
      -chart.north * 1000

    const chartBottom =
      -chart.south * 1000

    const intersects =
      !(
        chartRight < routeLeft ||
        chartLeft > routeRight ||
        chartBottom < routeTop ||
        chartTop > routeBottom
      )

    return intersects
  })
}