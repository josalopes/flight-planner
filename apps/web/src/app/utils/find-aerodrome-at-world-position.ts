import aerodromes from '@/data/aerodromes.json';
import { Point } from "../engine/types/Point";
import { latLonToWorld } from './latlon-to-world';
import { Aerodrome } from '@/server/aisweb/get-all-aerodromes';

export function findAerodromeAtWorldPosition(
  world: Point,
  tolerance: number
): Aerodrome | null {
  for (const airport of aerodromes) {

    const airportWorld =
      latLonToWorld(
        airport.lat,
        airport.lon
      )

    const distance =
      Math.hypot(
        world.x - airportWorld.x,
        world.y - airportWorld.y
      )

    if (distance <= tolerance) {
      return airport
    }
  }

  return null
}