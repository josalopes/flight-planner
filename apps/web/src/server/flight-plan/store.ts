import { FlightPlan } from "./types"

export const flightPlan: FlightPlan = {
  departure: null,
  arrival: null,
  waypoints: []
}

const listeners =
  new Set<() => void>()

export function subscribeFlightPlan(
  callback: () => void
) {

  listeners.add(callback)

  return () => {
    listeners.delete(callback)
  }
}

export function notifyFlightPlanChanged() {

  listeners.forEach(
    callback => callback()
  )
}