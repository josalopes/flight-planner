// use-flight-plan.ts

import { useContext } from "react"

import {
  FlightPlanContext
} from "../contexts/flight-plan-context"

export function useFlightPlan() {

  const context =
    useContext(
      FlightPlanContext
    )

  if (!context) {
    throw new Error(
      "useFlightPlan must be used inside FlightPlanProvider"
    )
  }

  return context
}