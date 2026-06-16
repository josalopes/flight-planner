import aerodromes from "@/data/aerodromes.json"
import { haversineNm } from "./get-distance"
import { Aerodrome } from "@/server/aisweb/get-all-aerodromes"

export function findNearestAerodrome(
  lat: number,
  lon: number,
  maxDistanceNm = 10
) {

  let nearest: Aerodrome | null = null

  let minDistance = Infinity

  for (const aerodrome of aerodromes) {

    const distance =
      haversineNm(
        lat,
        lon,
        aerodrome.lat,
        aerodrome.lon
      )

    if (distance < minDistance) {
      minDistance = distance
      nearest = aerodrome
    }
  }

   return minDistance <= maxDistanceNm
    ? nearest
    : null

  return nearest
}