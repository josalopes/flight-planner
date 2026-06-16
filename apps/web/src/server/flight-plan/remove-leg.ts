import { flightPlan } from "./store"

export function removeLeg(
  legIndex: number
) {

  // =====================
  // DEP → ARR
  // =====================

  if (
    flightPlan.waypoints.length === 0
  ) {

    // flightPlan.departure = null
    // flightPlan.arrival = null

    return
  }

  // =====================
  // PRIMEIRA PERNA
  // DEP → WP1
  // =====================

  if (legIndex === 0) {

    flightPlan.waypoints.splice(
      0,
      1
    )

    return
  }

  // =====================
  // ÚLTIMA PERNA
  // WPn → ARR
  // =====================

  if (
    legIndex ===
    flightPlan.waypoints.length
  ) {

    flightPlan.waypoints.splice(
      flightPlan.waypoints.length - 1,
      1
    )

    return
  }

  // =====================
  // INTERMEDIÁRIA
  // WPi → WPi+1
  // =====================

  flightPlan.waypoints.splice(
    legIndex,
    1
  )
}