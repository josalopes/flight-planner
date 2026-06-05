import { distanceNM } from "@/app/lib/navigation/distance-nm";
import { Aerodrome, FlightLeg } from "./types";
import { initialBearing } from "@/app/lib/navigation/initial-bearing";

export function createFlightLeg(
  origin: Aerodrome,
  destination: Aerodrome
): FlightLeg {
  return {
    origin,
    destination,

    distanceNM: distanceNM(
      origin.lat,
      origin.lon,
      destination.lat,
      destination.lon
    ),

    trueCourse: initialBearing(
      origin.lat,
      origin.lon,
      destination.lat,
      destination.lon
    )
  }
}