import { flightPlan } from "@/server/flight-plan/store"
import { haversineNm } from "./get-distance"

export function findWaypointAtPosition(
  lat: number,
  lon: number,
  maxDistanceNm = 5
) {

  let nearest = null
  let minDistance = Infinity

  for (
    const waypoint
    of flightPlan.waypoints
  ) {

    const distance =
      haversineNm(
        lat,
        lon,
        waypoint.lat,
        waypoint.lon
      )

    if (distance < minDistance) {

      minDistance = distance
      nearest = waypoint
    }
  }

  if (
    minDistance > maxDistanceNm
  ) {
    return null
  }

  return nearest
}