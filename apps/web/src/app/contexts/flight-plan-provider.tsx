"use client"

import { useState } from "react"

import {
  FlightPlanContext
} from "./flight-plan-context"

import {
  FlightPlanState
} from "./flight-plan-context"

export function FlightPlanProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [
    flightPlan,
    setFlightPlan
  ] = useState<FlightPlanState>({
    departure: null,
    arrival: null,
    waypoints: []
  })

  return (
    <FlightPlanContext.Provider
      value={{
        flightPlan,
        setFlightPlan
      }}
    >
      {children}
    </FlightPlanContext.Provider>
  )
}