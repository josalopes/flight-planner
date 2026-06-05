import { getAerodrome } from "@/server/aisweb/get-aerodrome"
import { CanvasEngine } from "../engine/CanvasEngine"
import { ImageLayer } from "../engine/layers/ImageLayer"
import { ObjectLayer } from "../engine/layers/ObjectLayer"
import { latLonToPixel } from "../utils/latlon-to-pixel"
import { RouteObject } from "../engine/objects/RouteObject"
import { latLonToWorld } from "../lib/navigation/latlon-to-world"

import georefData from "@/data/chart-georef.json"
import { Georeferencer } from "@/server/aisweb/geo-referencer"
import { PointObject } from "../engine/objects/PointObject"
import { SALVADOR_WAC } from "@/data/chart-catalogue"

export async function testRoute(
  engine: CanvasEngine
) {
  const georeferencer =
    new Georeferencer(
      georefData[
        "salvador_wac_20240808.pdf"
      ]
  )
    
  const partida = await getAerodrome("SNIU")
  const destino = await getAerodrome("SNJK")

  const imageLayer = engine.getLayer<ImageLayer>("image")

  const objectLayer = engine.getLayer<ObjectLayer>("objects")

  const crop = imageLayer?.getCrop()

  if (!crop || !objectLayer) return

//   const start =
//     latLonToPixel(
//       partida.lat,
//       partida.lon,
//       SALVADOR_WAC
//   )
  const start =
    georeferencer.latLonToWorld(
      partida.lat,
      partida.lon
  )


//   const end =
//     latLonToPixel(
//       destino.lat,
//       destino.lon,
//       SALVADOR_WAC
//   )
  const end =
    georeferencer.latLonToWorld(
      destino.lat,
      destino.lon
  )

    const scaleX = 38.14
    const scaleY = 38.00  

  // teste
//   const p1 =
//   georeferencer.latLonToWorld(
//     -14,
//     -40
//   )

//   console.log('P1', p1)

//   const px1 = p1.x * scaleX
//   const py1 = p1.y * scaleY - 8

//   objectLayer.add(
//     new PointObject(
//         px1,
//         py1,
//         "AISWEB",
//     )
//   )

//   const p2 =
//   georeferencer.latLonToWorld(
//     -14,
//     -41
//   )

//   console.log('P2', p2)

//   const px2 = p2.x * scaleX
//   const py2 = p2.y * scaleY - 8

//   objectLayer.add(
//     new PointObject(
//         px2,
//         py2,
//         "AISWEB",
//     )
//   )
  
//   const p3 =
//   georeferencer.latLonToWorld(
//     -14,
//     -39
//   )

//   console.log('P3', p3)

//   const px3 = p3.x * scaleX
//   const py3 = p3.y * scaleY - 8

//   objectLayer.add(
//     new PointObject(
//         px3,
//         py3,
//         "AISWEB",
//     )
//   )
  

  //

  const sbsv =
  latLonToPixel(
    -12.908611,
    -38.3225,
    SALVADOR_WAC
  )

  console.log(sbsv)

  start.x *= scaleX
  start.y = start.y * scaleY - 8

  end.x *= scaleX
  end.y = end.y * scaleY - 8

  objectLayer.add(
    new RouteObject(
      start,
      end,
      `${partida.icao} → ${destino.icao}`
    )
  )

//   console.log('SBIL',
//     georeferencer.latLonToWorld(
//         -14.82,
//         -39.03
//     )
//   )
  
//   console.log('SBSV',
//     georeferencer.latLonToWorld(
//         -12.91,
//         -38.32
//     )
//   )
  
//   console.log('SNIU',
//     georeferencer.latLonToWorld(
//         -14.17,
//         -39.68
//     )
//   )

//   console.log('SNJK',
//     georeferencer.latLonToWorld(
//         -13.88,
//         -40.10
//     )
//   )

//   console.log('Partida:', partida)
//   console.log('Destino:', destino)

//   console.log(`${partida.icao}`, start)
//   console.log(`${destino.icao}`, end)

  engine.render()
}