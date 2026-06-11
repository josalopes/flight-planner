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
import {flightPlan } from "@/server/flight-plan/store"
import { getAerodromeByIcao } from "@/server/aisweb/get-aerodrome-by-icao"
import { drawFlightPlan } from "@/server/flight-plan/draw-flight-plan"

export async function testRoute1(
  engine: CanvasEngine
) {
  flightPlan.departure =
    getAerodromeByIcao("SBSV")

  flightPlan.arrival =
    getAerodromeByIcao("SNJK")

  await drawFlightPlan(engine, true)

  // engine.removeLayersByPrefix("chart-")

  // const objectLayer =
  //   engine.getLayer<ObjectLayer>("objects")

  // if (!objectLayer)
  //   return

  // objectLayer.clear()

  // flightPlan.departure =
  //   getAerodromeByIcao("SBSV")

  // flightPlan.arrival =
  //   getAerodromeByIcao("SNJK")

  // await drawFlightPlan(engine, true)  

  // =====================================
  // TODOS OS PONTOS DA ROTA
  // =====================================

  // const routePoints = [
  //   {
  //     lat: flightPlan.departure?.lat,
  //     lon: flightPlan.departure?.lon
  //   },

  //   ...flightPlan.waypoints.map(
  //     waypoint => ({
  //       lat: waypoint.lat,
  //       lon: waypoint.lon
  //     })
  //   ),

  //   {
  //     lat: flightPlan.arrival?.lat,
  //     lon: flightPlan.arrival?.lon
  //   }
  // ]

  // // =====================================
  // // CARTAS NECESSÁRIAS
  // // =====================================

  // const chartsMap = new Map()

  // for (
  //   let i = 0;
  //   i < routePoints.length - 1;
  //   i++
  // ) {

  //   const start =
  //     latLonToWorld(
  //       routePoints[i].lat,
  //       routePoints[i].lon
  //     )

  //   const end =
  //     latLonToWorld(
  //       routePoints[i + 1].lat,
  //       routePoints[i + 1].lon
  //     )

  //   const charts =
  //     findChartsAlongRoute(
  //       start,
  //       end
  //     )

  //   for (const chart of charts) {
  //     chartsMap.set(
  //       chart.id,
  //       chart
  //     )
  //   }
  // }

  // // =====================================
  // // CARREGA CARTAS
  // // =====================================

  // for (
  //   const chart
  //   of chartsMap.values()
  // ) {

  //   if (
  //     engine.getLayer(
  //       `chart-${chart.id}`
  //     )
  //   ) {
  //     continue
  //   }

  //   const layer =
  //     new ChartLayer(chart)

  //   engine.addLayerAt(
  //     0,
  //     layer
  //   )

  //   const image =
  //     await loadChart(chart)

  //   layer.setImage(image)
  // }

  // // =====================================
  // // FIT ROUTE
  // // =====================================

  // const firstPoint =
  //   routePoints[0]

  // const lastPoint =
  //   routePoints[
  //     routePoints.length - 1
  //   ]

  // const firstWorld =
  //   latLonToWorld(
  //     firstPoint.lat,
  //     firstPoint.lon
  //   )

  // const lastWorld =
  //   latLonToWorld(
  //     lastPoint.lat,
  //     lastPoint.lon
  //   )

  // engine.fitRoute(
  //   firstWorld,
  //   lastWorld
  // )

  // // =====================================
  // // DESENHA SEGMENTOS
  // // =====================================

  // for (
  //   let i = 0;
  //   i < routePoints.length - 1;
  //   i++
  // ) {

  //   const from =
  //     routePoints[i]

  //   const to =
  //     routePoints[i + 1]

  //   const start =
  //     latLonToWorld(
  //       from.lat,
  //       from.lon
  //     )

  //   const end =
  //     latLonToWorld(
  //       to.lat,
  //       to.lon
  //     )

  //   const distanceNm =
  //     haversineNm(
  //       from.lat,
  //       from.lon,
  //       to.lat,
  //       to.lon
  //     )

  //   const routeBearing =
  //     bearing(
  //       from.lat,
  //       from.lon,
  //       to.lat,
  //       to.lon
  //     )

  //   objectLayer.add(
  //     new RouteObject(
  //       start,
  //       end,
  //       distanceNm,
  //       routeBearing
  //     )
  //   )
  // }

  // engine.render()
}

// import { getAerodrome } from "@/server/aisweb/get-aerodrome"
// import { CanvasEngine } from "../engine/CanvasEngine"
// import { ObjectLayer } from "../engine/layers/ObjectLayer"
// import { RouteObject } from "../engine/objects/RouteObject"

// import { findChartByAerodrome } from "@/server/aisweb/find-chart"
// import { loadChart } from "@/server/aisweb/load-chart"
// import { latLonToWorld } from "./latlon-to-world"
// import { ChartLayer } from "../engine/layers/ChartLayer"
// import { bearing } from "./get-bearing"
// import { haversineNm } from "./get-distance"
// import { findChartsAlongRoute } from "./find-charts-along-route"

// export async function testRoute1(
//   engine: CanvasEngine
// ) {

//   engine.removeLayersByPrefix("chart-")

//   const objectLayer = engine.getLayer<ObjectLayer>("objects")
//   if (!objectLayer) return
  
//   const departure = await getAerodrome("SBSV")
//   const arrival = await getAerodrome("SNJK")

//   const departureChart =
//     findChartByAerodrome(
//       {
//         lat: departure.lat,
//         lon: departure.lon
//       }
//     )

//   if (!departureChart) {
//     throw new Error(
//       `Carta não encontrada para ${departure.icao}`
//     )
//   }

//   const arrivalChart =
//     findChartByAerodrome(
//       {
//           lat: arrival.lat,
//           lon: arrival.lon
//       }
//   )

//   if (!arrivalChart) {
//      throw new Error(
//        `Carta não encontrada para ${arrival.icao}`
//      )
//   }

//   const start =
//     latLonToWorld(
//       departure.lat,
//       departure.lon
//   )

//   const end =
//     latLonToWorld(
//         arrival.lat,
//         arrival.lon
//   )


//   const charts =
//   findChartsAlongRoute(
//     start,
//     end
//   )

//   for (const chart of charts) {

//     if (
//       engine.getLayer(
//         `chart-${chart.id}`
//       )
//     ) {
//     continue
//   }

//     const layer =
//       new ChartLayer(chart)

//     engine.addLayerAt(0, layer)

//     const image =
//       await loadChart(chart)

//     layer.setImage(image)
//   }

//   const centerLon =
//     (departureChart.west + departureChart.east) / 2

//   const centerLat =
//     (departureChart.north + departureChart.south) / 2

//   const center =
//     latLonToWorld(
//       centerLat,
//       centerLon
//   )
    
//   engine.fitRoute(
//       start,
//       end
//     )

//   const distanceNm =
//     haversineNm(
//         departure.lat,
//         departure.lon,
//         arrival.lat,
//         arrival.lon
//     )

//   const routeBearing =
//     bearing(
//         departure.lat,
//         departure.lon,
//         arrival.lat,
//         arrival.lon
//     )  

//   objectLayer.add(
//     new RouteObject(
//       start,
//       end,
//       distanceNm,
//       routeBearing
//     )
//   )

//   engine.render()
// }