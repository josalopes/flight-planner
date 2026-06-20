"use client"

import { useState, useEffect } from "react"
import { useCanvasEngine } from "../../hooks/useCanvasEngine"
import { CanvasViewer } from "../../components/canvas-viewer"

import { testRoute1 } from "@/app/utils/test-route1"
import { flightPlan, notifyFlightPlanChanged } from "@/server/flight-plan/store"
import { drawFlightPlan } from "@/server/flight-plan/draw-flight-plan"
import { ObjectLayer } from "@/app/engine/layers/ObjectLayer"
import { removeLeg } from "@/server/flight-plan/remove-leg"
import { clearFlightPlan } from "@/server/flight-plan/clear-flight-plan"

interface Props {
  label: string
  active: boolean
  onClick: () => void
}

export default function FlightPlannerWorkspace() {

  const [contextMenu, setContextMenu] = useState<any>(null)
  const { canvasRef, engine } = useCanvasEngine()

  const hasRoute =
    !!flightPlan.departure &&
    !!flightPlan.arrival

  useEffect(() => {
    if (!engine.current)
      return

    engine.current.onContextMenu =
      async info => {
        if (info.route) {
          setContextMenu(info)
          return
        }
        
        if (info.waypoint) {
          setContextMenu(info)

          return
        }

        if (info.airport) {
          if (!flightPlan.departure) {
            flightPlan.departure = info.airport
            notifyFlightPlanChanged()

            const objectLayer =
              engine.current!
                .getLayer<ObjectLayer>(
                  "objects"
                )

            if (objectLayer) {
              engine.current!.render()
            }

            return
          }

          if (!flightPlan.arrival) {
            if (
              info.airport.icao ===
              flightPlan.departure.icao
            ) {
              return
            }

            flightPlan.arrival = info.airport
            notifyFlightPlanChanged()

            await drawFlightPlan(
              engine.current!,
              true
            )

            return
          }

          setContextMenu(info)
          return

        }
        if (
          !info.airport &&
          !info.waypoint &&
          !info.route
        ) {
          setContextMenu(info)

          return
        }          
      }
  }, [engine])

  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null)
    }

    window.addEventListener(
      "click",
      handleClick
    )

    return () =>
      window.removeEventListener(
        "click",
        handleClick
      )

  }, [])

  useEffect(() => {
    const handleKeyDown =
      (e: KeyboardEvent) => {

        if (e.key === "Escape") {
          setContextMenu(null)
        }
      }

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      )

  }, [])

  async function handleLoadMap() {
    if (!engine.current) return
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/salvador_wac_20240808.pdf"

    // await loadPDFIntoEngine(url, engine.current)
    await testRoute1(engine.current)
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="w-full h-full relative">
        <CanvasViewer
          canvasRef={canvasRef}
          />
      
        {
          contextMenu && (
            <div
              className="
                fixed
                bg-white
                border
                rounded
                shadow-lg
                z-50
                min-w-55
                p-2
              "
              style={{
                left: contextMenu.screenX,
                top: contextMenu.screenY
              }}
            >
                            
              {
                contextMenu.airport && (
                  <>
                    <div className="font-semibold">
                      {contextMenu.airport.icao}
                    </div>

                    <div className="text-sm text-gray-600">
                      {contextMenu.airport.name}
                    </div>

                    <button
                      className="
                        mt-2
                        w-full
                        text-left
                        px-2
                        py-1
                        hover:bg-gray-100
                      "
                      onClick={async () => {
                        const exists =
                          flightPlan.waypoints.some(
                            wp =>
                              wp.type === "AERODROME" &&
                              wp.icao === contextMenu.airport.icao
                          )

                        if (!exists) {
                          flightPlan.waypoints.push({
                            id: crypto.randomUUID(),
                            name: contextMenu.airport.name,
                            icao: contextMenu.airport.icao,
                            lat: contextMenu.airport.lat,
                            lon: contextMenu.airport.lon,
                            type: "AERODROME"
                          })

                          await drawFlightPlan(
                            engine.current!,
                            false
                          )
                        }

                        setContextMenu(null)
                      }}
                    >
                      Adicionar à rota
                    </button>
                  </>
                )
              }

              {
                contextMenu.waypoint && (
                  <>
                    <div className="font-semibold">
                      {
                        contextMenu.waypoint.icao ??
                        contextMenu.waypoint.name
                      }
                    </div>

                    <div className="text-sm text-gray-600">
                      {contextMenu.waypoint.name}
                    </div>

                    <button
                      onClick={async () => {
                        const index =
                          flightPlan.waypoints.findIndex(
                            wp =>
                              wp.id === contextMenu.waypoint.id
                          )

                        if (index >= 0) {
                          flightPlan.waypoints.splice(
                            index,
                            1
                          )

                          await drawFlightPlan(
                            engine.current!,
                            false
                          )
                        }

                        setContextMenu(null)
                      }}
                    >
                      Remover da rota
                    </button>
                  </>
                )
              }

              {
                contextMenu.route && (
                  <>
                    <button
                      onClick={async () => {
                        if (
                          flightPlan.waypoints.length === 0
                        ) {
                          clearFlightPlan()
                        } else {
                          removeLeg(
                            contextMenu.legIndex
                          )
                        }

                        await drawFlightPlan(
                          engine.current!,
                          false
                        )

                        setContextMenu(null)
                      }}
                    >
                      {
                        flightPlan.waypoints.length === 0
                          ? "Remover rota"
                          : "Remover perna"
                      }
                    </button>
                  </>
                )
              }


              {/* EMPTY */}
              {
                !contextMenu.airport &&
                !contextMenu.waypoint &&
                !contextMenu.route && (
                  <>
                    {hasRoute && (
                      <>
                        <div className="text-sm">
                          Lat:{" "}
                          {contextMenu.lat.toFixed(4)}

                          <br />

                          Lon:{" "}
                          {contextMenu.lon.toFixed(4)}
                        </div>

                        <button
                          className="
                            mt-2
                            w-full
                            text-left
                            px-2
                            py-1
                            hover:bg-gray-100
                          "
                          onClick={async () => {
                            const nextWpNumber =
                              flightPlan.waypoints.filter(
                                wp => wp.type === "USER"
                              ).length + 1

                            flightPlan.waypoints.push({
                              id: crypto.randomUUID(),
                              name: `WP${nextWpNumber}`,
                              lat: contextMenu.lat,
                              lon: contextMenu.lon,
                              type: "USER"
                            })

                            await drawFlightPlan(
                              engine.current!,
                              false
                            )

                            setContextMenu(null)
                          }}
                        >
                          Criar waypoint
                        </button>

                        <hr className="my-1"/>  
                      </>
                    )}
                    
                    <button
                      onClick={() => {
                        engine.current?.setTool("measure")
                        setContextMenu(null)
                      }}
                    >
                      Medir distância
                    </button>
                  </>
                )
              }
            </div>
          )}
        </div>
    </div>
  )
}

