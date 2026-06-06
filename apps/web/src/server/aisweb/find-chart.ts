import { CHART_CATALOGUE } from "@/data/chart-catalogue"

export function findChartByAerodrome(
  aerodrome: {
    lat: number
    lon: number
  }
) {
  return findChart(
    aerodrome.lat,
    aerodrome.lon
  )
}

function findChart(
  lat: number,
  lon: number
) {
  return CHART_CATALOGUE.find(chart =>
    lat <= chart.north &&
    lat >= chart.south &&
    lon >= chart.west &&
    lon <= chart.east
  )
}

export function findChartByLatLon(
  lat: number,
  lon: number
) {
  return CHART_CATALOGUE.find(chart =>
    lat <= chart.north &&
    lat >= chart.south &&
    lon >= chart.west &&
    lon <= chart.east
  )
}