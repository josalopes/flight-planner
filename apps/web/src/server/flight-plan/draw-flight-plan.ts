import { CanvasEngine } from "@/app/engine/CanvasEngine";
import { flightPlan } from "./store";
import { latLonToWorld } from "@/app/utils/latlon-to-world";
import { findChartsAlongRoute } from "@/app/utils/find-charts-along-route";
import { ChartLayer } from "@/app/engine/layers/ChartLayer";
import { loadChart } from "../aisweb/load-chart";
import { haversineNm } from "@/app/utils/get-distance";
import { bearing } from "@/app/utils/get-bearing";
import { RouteObject } from "@/app/engine/objects/RouteObject";
import { ObjectLayer } from "@/app/engine/layers/ObjectLayer";
import { WaypointObject } from "@/app/engine/objects/WaypointObject";


export async function drawFlightPlan(
  engine: CanvasEngine,
  fit = false
) {

    const objectLayer =
    engine.getLayer<ObjectLayer>("objects")

    if (!objectLayer) return

    if (
      !flightPlan.departure ||
      !flightPlan.arrival
      ) {
        return
        }

    objectLayer.clear()

    // =====================================
    // TODOS OS PONTOS DA ROTA
    // =====================================

    type RoutePoint = {
      lat: number
      lon: number
    }
    
    const routePoints: RoutePoint[] = [ 
      {
        lat: flightPlan.departure.lat,
        lon: flightPlan.departure.lon
      },

      ...flightPlan.waypoints.map(
           waypoint => ({
           lat: waypoint.lat,
           lon: waypoint.lon
        })
      ),

      {
        lat: flightPlan.arrival.lat,
        lon: flightPlan.arrival.lon
      }
    ]

    // =====================================
    // CARTAS NECESSÁRIAS
    // =====================================
  
    const chartsMap = new Map()
  
    for (
      let i = 0;
      i < routePoints.length - 1;
      i++
    ) {
  
      const start =
        latLonToWorld(
          routePoints[i].lat,
          routePoints[i].lon
      )
  
      const end =
        latLonToWorld(
          routePoints[i + 1].lat,
          routePoints[i + 1].lon
      )
  
      const charts =
        findChartsAlongRoute(
          start,
          end
      )
  
      for (const chart of charts) {
        chartsMap.set(
          chart.id,
          chart
        )
      }
    }

    // =====================================
    // CARREGA CARTAS
    // =====================================

    for (
      const chart
      of chartsMap.values()
    ) {
      if (
          engine.getLayer(
          `chart-${chart.id}`
          )
      ) {
          continue
      }

      const layer = new ChartLayer(chart)
      layer.isRouteChart = true

      engine.addChartLayer(layer)      

      const image =
          await loadChart(chart)

      layer.setImage(image)

      engine.hasFlightPlan = true
    }
    
    // =====================================
    // FIT ROUTE
    // =====================================

    const firstPoint =
      routePoints[0]

    const lastPoint =
      routePoints[
        routePoints.length - 1
      ]

    const firstWorld =
      latLonToWorld(
        firstPoint.lat,
        firstPoint.lon
      )

    const lastWorld =
      latLonToWorld(
        lastPoint.lat,
        lastPoint.lon
      )

    if (fit) {
      engine.fitRoute(
        firstWorld,
        lastWorld
      )
    }

    // =====================================
    // DESENHA SEGMENTOS
    // =====================================

    for (
      let i = 0;
      i < routePoints.length - 1;
      i++
    ) {

      const from =
        routePoints[i]

      const to =
        routePoints[i + 1]

      const start =
        latLonToWorld(
          from.lat,
          from.lon
        )

      const end =
        latLonToWorld(
          to.lat,
          to.lon
        )

      const distanceNm =
        haversineNm(
          from.lat,
          from.lon,
          to.lat,
          to.lon
        )

      const routeBearing =
        bearing(
          from.lat,
          from.lon,
          to.lat,
          to.lon
        )

      objectLayer.add(
        new RouteObject(
          start,
          end,
          distanceNm,
          routeBearing
        )
      )
    }

    for (
      const waypoint
      of flightPlan.waypoints
      ) {

      const world =
          latLonToWorld(
          waypoint.lat,
          waypoint.lon
          )

      objectLayer.add(
        new WaypointObject(
          world,
          waypoint.icao ??
          waypoint.name,
          waypoint.type,
          waypoint.id
        )
      )
    }

  engine.render() 
         
}