import aerodromes from "@/data/aerodromes.json"

import { Aerodrome } from "./types"

export function getAerodromeByIcao(
  icao: string
): Aerodrome {

  const aerodrome =
    aerodromes.find(
      airport =>
        airport.icao ===
        icao.toUpperCase()
    )

  if (!aerodrome) {
    throw new Error(
      `Aeródromo ${icao} não encontrado`
    )
  }

  return aerodrome
}