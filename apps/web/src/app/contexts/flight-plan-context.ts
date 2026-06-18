"use client"

import { createContext } from "react"
import { Aerodrome } from "@/server/aisweb/get-all-aerodromes"
import { Waypoint } from "@/server/flight-plan/types"

export interface FlightPlanState {
  departure: Aerodrome | null
  arrival: Aerodrome | null
  waypoints: Waypoint[]
}

export interface FlightPlanContextData {
  flightPlan: FlightPlanState

  setFlightPlan:
    React.Dispatch<
      React.SetStateAction<FlightPlanState>
    >
}

export const FlightPlanContext =
  createContext<
    FlightPlanContextData | null
  >(null)