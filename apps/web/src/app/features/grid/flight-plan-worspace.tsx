"use client"

import { useState, useEffect, useRef } from "react"
import { useCanvasEngine } from "../../hooks/useCanvasEngine"
import { CanvasViewer } from "../../components/canvas-viewer"
import { GridLayer } from "../../engine/layers/GridLayer"
import { ImageLayer } from "../../engine/layers/ImageLayer"
import { CrosshairLayer } from "../../engine/layers/CrossHairLayer"
import { RulerUnit } from "../../engine/layers/RulerLayer"
import { Separator } from "@/components/ui/separator"

import { testRoute1 } from "@/app/utils/test-route1"
import { flightPlan } from "@/server/flight-plan/store"
import { drawFlightPlan } from "@/server/flight-plan/draw-flight-plan"

interface Props {
  label: string
  active: boolean
  onClick: () => void
}

export function ToolButton({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded ${
        active ? "bg-blue-600 text-white" : "bg-gray-200"
      }`}
    >
      {label}
    </button>
  )
}

export default function FlightPlannerWorkspace() {
  /* ============================= */
  /* ========= STATES ============ */
  /* ============================= */

  const [spacing, setSpacing] = useState(1)
  const [thickness, setThickness] = useState(1)
  const [color, setColor] = useState("#000000")
  const [dpi, setDpi] = useState(96)
  const [paperSize, setPaperSize] = useState("A4")
  const [orientation, setOrientation] = useState("portrait")
  const [showSubdivisions, setShowSubdivisions] = useState(false)
  const [showMainGrid, setShowMainGrid] = useState(false)
  const [showCrosshair, setShowCrosshair] = useState(true)
  const [contextMenu, setContextMenu] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { canvasRef, engine } = useCanvasEngine()

  useEffect(() => {
    if (!engine.current)
      return

    engine.current.onContextMenu =
      info => {
        setContextMenu(info)
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

  const loadImage = (file: File) => {
    const img = new Image()

    img.onload = () => {
      const imageLayer = engine.current?.getLayer<ImageLayer>("image")
      if (!imageLayer) return

      imageLayer.setImage(img)
      engine.current?.render()
    }

    img.src = URL.createObjectURL(file)
  }
  
  const toggleCrosshair = () => {
    const layer = engine.current?.getLayer<CrosshairLayer>("crosshair")
    if (!layer) return
    layer.visible = !layer.visible
    engine.current?.render()
    setShowCrosshair(!showCrosshair)
  }

  const handleUnitChange = (unit: RulerUnit) => {
    if (!engine.current) return

    engine.current.unit = unit
    engine.current?.render()
  }

  /* ============================= */
  /* ===== GRID CONFIG UPDATE ==== */
  /* ============================= */

  useEffect(() => {
    const eng = engine.current
    if (!eng) return

    const gridLayer = eng.getLayer<GridLayer>("grid")
    if (!gridLayer) return

    gridLayer.spacingUnits = spacing
    eng.render()

    gridLayer.color = color
    gridLayer.thickness = thickness
    gridLayer.showMainGrid = showMainGrid
    gridLayer.showSubdivisions = showSubdivisions

    eng.render()
  }, [
    spacing,
    thickness,
    color,
    dpi,
    showMainGrid,
    showSubdivisions
  ])

  async function handleLoadMap() {
    if (!engine.current) return
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/salvador_wac_20240808.pdf"

    // await loadPDFIntoEngine(url, engine.current)
    await testRoute1(engine.current)
    // await loadChartForCalibration(url, engine.current)
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
                        // e => e.stopProgagation()
                        const index =
                          flightPlan.waypoints.findIndex(
                            wp =>
                              wp.id ===
                              contextMenu.waypoint.id
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
                        // e => e.stopProgagation()
                        const exists =
                          flightPlan.waypoints.some(
                            wp =>
                              wp.icao === "AERODROME" &&
                              contextMenu.airport.icao
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

              {/* EMPTY */}
              {
                !contextMenu.airport &&
                !contextMenu.waypoint && (
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
                        // e => e.stopProgagation()
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
                  </>
                )
              }
            </div>
          )}
        </div>
    </div>
  )
}

