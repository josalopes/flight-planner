import aerodromes
  from "@/data/aerodromes.json"

import { CanvasLayer } from "../types/CanvasLayer"
import { CanvasEngine } from "../CanvasEngine"
import { latLonToWorld } from "@/app/utils/latlon-to-world"
import { REGIONS } from "@/app/constants/regions"


export class AerodromeLayer
  implements CanvasLayer {
  id = "aerodromes"
  visible = true

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {

    let visibleAirports =
      [...aerodromes]

    const region =
      engine.aerodromeFilter.region

    if (region &&
      region !== "Todas") {

      const states =
        REGIONS[
          region as keyof typeof REGIONS
        ]

      visibleAirports =
        visibleAirports.filter(
          airport =>
            states.includes(
              airport.uf
            )
        )
    }

    engine.visibleAerodromesCount =
      visibleAirports.length

    const radius =
      3 / engine.scale

    ctx.fillStyle = "#1d4ed8"
      
    for (
      const airport
      of visibleAirports
    ) {
        const world =
            latLonToWorld(
            airport.lat,
            airport.lon
          )

        ctx.beginPath()

        ctx.moveTo(
          world.x,
          world.y - radius
        )
        
        ctx.lineTo(
          world.x + radius,
          world.y
        )
        
        ctx.lineTo(
          world.x,
          world.y + radius
        )
        
        ctx.lineTo(
          world.x - radius,
          world.y
        )
        
        ctx.closePath()
        
        ctx.fill()

         // ICAO
        if (
          engine.scale > 0.30
        ) {

            ctx.fillStyle = "#000"

            ctx.font =
              `${10 / engine.scale}px sans-serif`

            ctx.fillText(
              airport.icao,
              world.x +
                radius * 2,
              world.y
            )

            ctx.fillStyle =
              "#1d4ed8"
          }

        // Cidade
    if (
      engine.scale > 0.60
    ) {
        ctx.fillStyle = "#444"
        ctx.font =
          `${7 / engine.scale}px sans-serif`

        ctx.fillText(
          airport.name,
          world.x +
            radius * 2,
          world.y +
            35 / engine.scale
        )
          
        ctx.fillStyle =
          "#1d4ed8"
      }  
    }
  }
}