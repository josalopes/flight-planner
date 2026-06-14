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

export const BASEMAP_EXTENT = {
  west: -102.83338516900395,
  south: -42.16181763339097,
  east: -15.288304326921406,
  north: 13.892226934561162
}

export const CHART_ZOOM_THRESHOLD = 0.10
