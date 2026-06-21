"use client"

import { useEffect, useState } from "react"

import { useCanvasEngineContext }
  from "@/app/contexts/canvas-engine-context"

import { worldToLatLon }
  from "@/app/utils/world-to-latlon"
import { decimalToDMS } from "@/app/utils/decimal-to-dms"

export function StatusBar() {

  const { engine } =
    useCanvasEngineContext()

  const [, forceRefresh] =
    useState(0)

  useEffect(() => {

    const timer =
      setInterval(() => {

        forceRefresh(
          value => value + 1
        )

      }, 250)

    return () =>
      clearInterval(timer)

  }, [])

  if (!engine) {
    return null
  }

  const position =
    worldToLatLon(
      engine.cursor.x,
      engine.cursor.y
    )

    const latDMS =
    decimalToDMS(
      position.lat,
      "lat"
    )
  
  const lonDMS =
    decimalToDMS(
      position.lon,
      "lon"
    )  

  return (
    <div
      className="
        h-6
        border-t
        px-2
        text-xs
        flex
        items-center
        gap-4
      "
    >

      <span>
        Aeródromos:
        {" "}
        {engine.visibleAerodromesCount}
      </span>

      <span>
        Região:
        {" "}
        {engine.aerodromeFilter.region}
      </span>

      <span>
        Zoom:
        {" "}
        {(engine.scale * 100)
          .toFixed(0)}
        %
      </span>

      <span>
        Cursor:
        {" "}
        {latDMS}
        {" | "}
        {lonDMS}
      </span>

    </div>
  )
}