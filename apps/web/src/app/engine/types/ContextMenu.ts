import { Aerodrome, Waypoint } from "@/server/flight-plan/types"
import { RouteObject } from "../objects/RouteObject"

export interface ContextMenuInfo {
  screenX: number
  screenY: number

  lat: number
  lon: number

  airport?: Aerodrome
  waypoint?: Waypoint

  legIndex?: number
  route?: RouteObject
}