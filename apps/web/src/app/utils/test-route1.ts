import { getAerodrome } from "@/server/aisweb/get-aerodrome"
import { CanvasEngine } from "../engine/CanvasEngine"
import { ObjectLayer } from "../engine/layers/ObjectLayer"
import { RouteObject } from "../engine/objects/RouteObject"

import { findChartByAerodrome } from "@/server/aisweb/find-chart"
import { loadChart } from "@/server/aisweb/load-chart"
import { latLonToWorld } from "./latlon-to-world"
import { ChartLayer } from "../engine/layers/ChartLayer"
import { bearing } from "./get-bearing"
import { haversineNm } from "./get-distance"
import { findChartsAlongRoute } from "./find-charts-along-route"

export async function testRoute1(
  engine: CanvasEngine
) {

  engine.removeLayersByPrefix("chart-")

  const objectLayer = engine.getLayer<ObjectLayer>("objects")
  if (!objectLayer) return
  
  const departure = await getAerodrome("SBSV")
  const arrival = await getAerodrome("SNJK")

  const departureChart =
    findChartByAerodrome(
      {
        lat: departure.lat,
        lon: departure.lon
      }
    )

  if (!departureChart) {
    throw new Error(
      `Carta não encontrada para ${departure.icao}`
    )
  }

  const arrivalChart =
    findChartByAerodrome(
      {
          lat: arrival.lat,
          lon: arrival.lon
      }
  )

  if (!arrivalChart) {
     throw new Error(
       `Carta não encontrada para ${arrival.icao}`
     )
  }

  const start =
    latLonToWorld(
      departure.lat,
      departure.lon
  )

  const end =
    latLonToWorld(
        arrival.lat,
        arrival.lon
  )


  const charts =
  findChartsAlongRoute(
    start,
    end
  )

  for (const chart of charts) {

    if (
      engine.getLayer(
        `chart-${chart.id}`
      )
    ) {
    continue
  }

    const layer =
      new ChartLayer(chart)

    engine.addLayerAt(0, layer)

    const image =
      await loadChart(chart)

    layer.setImage(image)
  }


  // let departureLayer =
  //     engine.getLayer<ChartLayer>(
  //      `chart-${departureChart.id}`
  //  )

  //  if (!departureLayer) {
  //      departureLayer = new ChartLayer(departureChart)

  //     engine.addLayerAt(
  //       0,
  //       departureLayer
  //     )
  //  }

  // let arrivalLayer =
  //       engine.getLayer<ChartLayer>(
  //         `chart-${arrivalChart.id}`
  // )

  // if (!arrivalLayer) {
  //     arrivalLayer = new ChartLayer(arrivalChart)

  //     engine.addLayerAt(
  //         1,
  //         arrivalLayer
  //     )
  // }

  // const departureImg = await loadChart(departureChart)
  // departureLayer.setImage(departureImg)

  // const arrivalImg = await loadChart(arrivalChart)
  // arrivalLayer.setImage(arrivalImg)


  const centerLon =
    (departureChart.west + departureChart.east) / 2

  const centerLat =
    (departureChart.north + departureChart.south) / 2

  const center =
    latLonToWorld(
      centerLat,
      centerLon
  )

  
    
  engine.fitRoute(
      start,
      end
    )

  const distanceNm =
    haversineNm(
        departure.lat,
        departure.lon,
        arrival.lat,
        arrival.lon
    )

  const routeBearing =
    bearing(
        departure.lat,
        departure.lon,
        arrival.lat,
        arrival.lon
    )  

  objectLayer.add(
    new RouteObject(
      start,
      end,
      // `${departure.icao} → ${arrival.icao}`,
      distanceNm,
      routeBearing
    )
  )

  engine.render()
}