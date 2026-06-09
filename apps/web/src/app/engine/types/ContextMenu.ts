import { Aerodrome, Waypoint } from "@/server/flight-plan/types"

export interface ContextMenuInfo {
  screenX: number
  screenY: number

  lat: number
  lon: number

  airport?: Aerodrome
  waypoint?: Waypoint
}