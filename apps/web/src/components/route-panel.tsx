"use client"

import { useEffect, useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"

import {
  ChevronDown,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { flightPlan, notifyFlightPlanChanged, subscribeFlightPlan } from "@/server/flight-plan/store"
import { clearFlightPlan } from "@/server/flight-plan/clear-flight-plan"
import { drawFlightPlan } from "@/server/flight-plan/draw-flight-plan"

import { useCanvasEngineContext } from "@/app/contexts/canvas-engine-context"

export function RoutePanel() {
  const [open, setOpen] = useState(true)
  const { engine } = useCanvasEngineContext()
  const [, setRefresh] = useState(0)

  const hasRoute =
    !!flightPlan.departure &&
    !!flightPlan.arrival


  useEffect(() => {
    return subscribeFlightPlan(
      () =>
        setRefresh(
          state => state + 1
        )
    )

  }, [])

  async function handleClearRoute() {
    if (!engine)
      return

    clearFlightPlan()
    // notifyFlightPlanChanged()

    await drawFlightPlan(
      engine,
      false
    )
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger
        className="
          flex
          items-center
          justify-between
          w-full
          px-2
          py-2
          rounded-md
          hover:bg-accent
        "
      >
        <span>
          Rota
        </span>

        {
          open
            ? <ChevronDown className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />
        }
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex flex-col gap-2 mt-2">
          <div className="text-sm">
            <div>
              Departure:
              {" "}
              {
                flightPlan.departure?.icao ??
                ""
              }
            </div>

            <div>
              Arrival:
              {" "}
              {
                flightPlan.arrival?.icao ??
                ""
              }
            </div>

            <div>
              Waypoints:
              {" "}
              {
                flightPlan.waypoints.length
              }
            </div>

          </div>

          <Button
            variant="outline"
            disabled={!hasRoute}
          >
            Nova rota
          </Button>

          <Button
            variant="destructive"
            disabled={!hasRoute}
            onClick={handleClearRoute}
          >
            Remover rota
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}