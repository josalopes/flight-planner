import { flightPlan } from "./store"

export function clearFlightPlan() {

  flightPlan.departure = null
  flightPlan.arrival = null
  flightPlan.waypoints = []
  
}