import { ChartMetadata } from "@/server/aisweb/types";

export function latLonToPixel(
  lat: number,
  lon: number,
  chart: ChartMetadata
) {
  return {
    x:
      (
        (lon - chart.west)
        /
        (
          chart.east -
          chart.west
        )
      )
      * chart.width,

    y:
      (
        (chart.north - lat)
        /
        (
          chart.north -
          chart.south
        )
      )
      * chart.height
  }
}

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