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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { Button }
  from "@/components/ui/button"

// import { Button } from "@/components/ui/button"

import { flightPlan, notifyFlightPlanChanged, subscribeFlightPlan } from "@/server/flight-plan/store"
import { clearFlightPlan } from "@/server/flight-plan/clear-flight-plan"
import { drawFlightPlan } from "@/server/flight-plan/draw-flight-plan"

import { useCanvasEngineContext } from "@/app/contexts/canvas-engine-context"
import { RouteDirectDialog } from "./route-direct-dialog"
import { createDirectRoute } from "@/server/flight-plan/create-direct-route"

export function RoutePanel() {
  const [open, setOpen] = useState(true)
  const { engine } = useCanvasEngineContext()
  const [, setRefresh] = useState(0)
  const [
    directRouteOpen,
    setDirectRouteOpen
  ] = useState(false)

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

    await drawFlightPlan(
      engine,
      false
    )
  }

  return (
    <>    
      <Collapsible
        open={false}
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
              onClick={() =>
                setDirectRouteOpen(true)
              }
            >
              Rota direta
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

      <RouteDirectDialog
        open={directRouteOpen}
        onOpenChange={open => {

          if (!open) {
            engine?.setTool(
              "pan"
            )
          }
      
          setDirectRouteOpen(open)
      
        }}
        onCreate={async (
          departure,
          arrival
        ) => {  
          if (!engine) 
            return

          await createDirectRoute(
            engine,
            departure,
            arrival
          )
        }}
      />
    </>

    )
}