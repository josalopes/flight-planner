import { getAerodrome } from "@/server/aisweb/get-aerodrome"
import { CanvasEngine } from "../engine/CanvasEngine"
import { ObjectLayer } from "../engine/layers/ObjectLayer"
import { RouteObject } from "../engine/objects/RouteObject"

import { findChartByAerodrome } from "@/server/aisweb/find-chart"
import { loadChart } from "@/server/aisweb/load-chart"
import { latLonToWorld } from "./latlon-to-world"
import { ChartLayer } from "../engine/layers/ChartLayer"
import { RECIFE_WAC, SALVADOR_WAC } from "@/data/chart-catalogue"

export async function testRoute1(
  engine: CanvasEngine
) {

  const objectLayer = engine.getLayer<ObjectLayer>("objects")
  if (!objectLayer) return
  
  const partida = await getAerodrome("SBSV")
  const destino = await getAerodrome("SBAR")

  const salvadorLayer = new ChartLayer(SALVADOR_WAC)
  const recifeLayer = new ChartLayer(RECIFE_WAC)

  if (!engine.getLayer(`chart-${SALVADOR_WAC.id}`)) {
    engine.addLayerAt(0, salvadorLayer)
  }

  if (!engine.getLayer(`chart-${RECIFE_WAC.id}`)) {
    engine.addLayerAt(1, recifeLayer)
  }

  const salvadorImg = await loadChart(SALVADOR_WAC)
  salvadorLayer.setImage(salvadorImg)

  const recifeImg = await loadChart(RECIFE_WAC)
  recifeLayer.setImage(recifeImg)

  const partidaChart =
    findChartByAerodrome(
        {
        lat: partida.lat,
        lon: partida.lon
        }
    )

  if (!partidaChart) {
    throw new Error(
        `Carta não encontrada para ${partida.icao}`
    )
  }

  const destinoChart =
    findChartByAerodrome(
        {
          lat: destino.lat,
          lon: destino.lon
        }
   )

   if (!destinoChart) {
     throw new Error(
       `Carta não encontrada para ${destino.icao}`
     )
   }

   const start =
    latLonToWorld(
        partida.lat,
        partida.lon
    )

    engine.centerAt(
        start.x,
        start.y,
        0.4
    )

    const end =
      latLonToWorld(
        destino.lat,
        destino.lon
    )


  objectLayer.add(
    new RouteObject(
      start,
      end,
      `${partida.icao} → ${destino.icao}`
    )
  )

  engine.render()
}