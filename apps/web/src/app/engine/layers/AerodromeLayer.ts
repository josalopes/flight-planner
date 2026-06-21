import aerodromes
  from "@/data/aerodromes.json"

import { CanvasLayer } from "../types/CanvasLayer"
import { CanvasEngine } from "../CanvasEngine"
import { latLonToWorld } from "@/app/utils/latlon-to-world"

const capitals = [
  "Goiânia",
  "Cuiabá",
  "Campo Grande",
  "Brasília",
  "Maceió",
  "Salvador",
  "Fortaleza",
  "São Luís",
  "João Pessoa",
  "Recife",
  "Teresina",
  "Aracaju",
  "Rio Branco",
  "Macapá",
  "Manaus",
  "Belém",
  "Porto Velho",
  "Boa Vista",
  "Palmas",
  "Vitória",
  "Belo Horizonte",
  "Rio de Janeiro",
  "São Paulo",
  "Curitiba",
  "Porto Alegre",
  "Florianópolis",
  ]

export class AerodromeLayer
  implements CanvasLayer {

  id = "aerodromes"

  visible = true

  

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {

    const visibleAirports =
      engine.scale < 0.03
        ? aerodromes.filter(
            airport =>
              capitals.includes(
                airport.city
              )
          )
        : aerodromes  

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
        airport.city,
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