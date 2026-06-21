import { CanvasEngine } from "@/app/engine/CanvasEngine"
import { Aerodrome } from "./types"
import { flightPlan, notifyFlightPlanChanged } from "./store"
import { drawFlightPlan } from "./draw-flight-plan"

export async function createDirectRoute(
    engine: CanvasEngine,
    departure: Aerodrome,
    arrival: Aerodrome
  ) {
  
    flightPlan.departure =
      departure
  
    flightPlan.arrival =
      arrival
  
    flightPlan.waypoints = []
  
    notifyFlightPlanChanged()
  
    await drawFlightPlan(
      engine,
      true
    )

    engine.setTool("pan")
  }