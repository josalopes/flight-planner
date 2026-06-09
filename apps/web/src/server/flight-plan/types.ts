// import { Aerodrome } from "@/server/aisweb/types"

export interface Aerodrome {
  icao: string
  name: string
  city: string
  uf: string
  lat: number
  lon: number
}

export interface Waypoint {
  id: string
  name: string
  icao?: string
  lat: number
  lon: number
  type:
    | "AERODROME"
    | "USER"
}

export interface FlightPlan {
  departure: Aerodrome | null
  arrival: Aerodrome | null
  waypoints: Waypoint[]
}

export interface ContextMenuInfo {
  screenX: number
  screenY: number
  lat: number
  lon: number
  airport?: Aerodrome
  waypoint?: Waypoint
}

export interface FlightLeg {
  origin: Aerodrome
  destination: Aerodrome

  distanceNM: number
  trueCourse: number
}

// export class AerodromeStore {

//   private airports: Aerodrome[] = []

//   async load() {
//     this.airports =
//       await getAllAerodromes()
//   }

//   getAll() {
//     return this.airports
//   }
// }