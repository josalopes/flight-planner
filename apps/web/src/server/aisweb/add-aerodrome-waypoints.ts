import { flightPlan } from "../flight-plan/store"
import { getAerodromeByIcao } from "./get-aerodrome-by-icao"

export function addAerodromeWaypoint(
  icao: string
) {

  const airport =
    getAerodromeByIcao(icao)

  flightPlan.waypoints.push({
    id: crypto.randomUUID(),
    name: airport.icao,
    lat: airport.lat,
    lon: airport.lon,
    type: "AERODROME"
  })
}