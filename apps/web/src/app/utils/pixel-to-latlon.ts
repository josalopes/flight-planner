import { ChartMetadata } from "@/server/aisweb/types";

export function pixelToLatLon(
  x: number,
  y: number,
  chart: ChartMetadata
) {
  return {
    lon:
      chart.west +
      (
        x / chart.width
      )
      *
      (
        chart.east -
        chart.west
      ),

    lat:
      chart.north -
      (
        y / chart.height
      )
      *
      (
        chart.north -
        chart.south
      )
  }
}