// tools/PanTool.ts

import { worldToLatLon } from "@/app/utils/world-to-latlon"
import { CanvasEngine } from "../CanvasEngine"
import { ObjectLayer } from "../layers/ObjectLayer"
import { Tool } from "../types/Tool"
import { drawFlightPlan } from "@/server/flight-plan/draw-flight-plan"
import { findAerodromeAtWorldPosition } from "@/app/utils/find-aerodrome-at-world-position"
import { AERODROME_HIT_RADIUS } from "@/server/flight-plan/flight-planner-config"
import { flightPlan, notifyFlightPlanChanged } from "@/server/flight-plan/store"

export class PanTool implements Tool{
  id = "pan"
  cursor = "default"

  private isDragging = false
  private lastPos = { x: 0, y: 0 }

  onMouseDown(
    engine: CanvasEngine,
    e: MouseEvent
  ) {

      // ======================
      // DEPARTURE
      // ======================

      if (
        engine.hoveredAerodrome &&
        flightPlan.departure &&
        engine.hoveredAerodrome.icao ===
          flightPlan.departure.icao
      ) {
        engine.draggedWaypointType =
          "DEPARTURE"

        engine.isDraggingWaypoint =
          true

        return
      }

      // ======================
      // ARRIVAL
      // ======================

      if (
        engine.hoveredAerodrome &&
        flightPlan.arrival &&
        engine.hoveredAerodrome.icao ===
          flightPlan.arrival.icao
      ) {
        engine.draggedWaypointType =
          "ARRIVAL"

        engine.isDraggingWaypoint =
          true

        return
      }

      // ======================
      // WAYPOINT NORMAL
      // ======================

      if (engine.hoveredWaypoint) {

        engine.draggedWaypoint =
          engine.hoveredWaypoint

        engine.draggedWaypointType =
          "USER"

        engine.isDraggingWaypoint =
          true

        return
      }

      this.isDragging = true

      this.lastPos = {
        x: e.clientX,
        y: e.clientY
      }
    }

  async onMouseMove(engine: CanvasEngine, e: MouseEvent) {      
    if (
        engine.isDraggingWaypoint
      ) {

        const world =
          engine.getWorldFromMouseEvent(
            e
          )

        // ======================
        // WAYPOINT USER
        // ======================

        if (
          engine.draggedWaypointType ===
          "USER" &&
          engine.draggedWaypoint
        ) {

          const objectLayer =
            engine.getLayer<ObjectLayer>(
              "objects"
            )

          const wpObject =
            objectLayer
              ?.getWaypointObjects()
              .find(
                wp =>
                  wp.waypointId ===
                  engine.draggedWaypoint!.id
              )

          if (wpObject) {

            wpObject.position.x =
              world.x

            wpObject.position.y =
              world.y

            const latLon =
              worldToLatLon(
                world.x,
                world.y
              )

            engine.draggedWaypoint.lat =
              latLon.lat

            engine.draggedWaypoint.lon =
              latLon.lon

            objectLayer
              ?.updateRouteObjects()

            engine.render()
          }

          return
        }

        // ======================
        // DEPARTURE / ARRIVAL
        // ======================

        if (
          engine.draggedWaypointType ===
            "DEPARTURE" ||
          engine.draggedWaypointType ===
            "ARRIVAL"
        ) {
          const objectLayer =
            engine.getLayer<ObjectLayer>(
              "objects"
            )

          const marker =
            objectLayer
              ?.getWaypointObjects()
              .find(
                wp =>
                  wp.waypointType ===
                  engine.draggedWaypointType
              )

          if (marker) {
            marker.position.x =
              world.x

            marker.position.y =
              world.y

            if (
              engine.draggedWaypointType ===
              "DEPARTURE"
            ) {

              objectLayer
                ?.updateDeparturePreview(
                  marker.position
                )
            }

            if (
              engine.draggedWaypointType ===
              "ARRIVAL"
            ) {

              objectLayer
                ?.updateArrivalPreview(
                  marker.position
                )
            } 

            engine.render()
          }

          return
        }
      }

      if (!this.isDragging) 
        return

      const dx = e.clientX - this.lastPos.x
      const dy = e.clientY - this.lastPos.y

      engine.offset.x += dx
      engine.offset.y += dy

      this.lastPos = { x: e.clientX, y: e.clientY }

      engine.render()

  }
  
  async onMouseUp(engine: CanvasEngine) {
    const objectLayer =
      engine.getLayer<ObjectLayer>(
        "objects"
      )
    if (
      engine.draggedWaypointType ===
      "DEPARTURE"
    ) {
        const depObject =
          objectLayer
            ?.getWaypointObjects()
            .find(
              wp =>
                wp.waypointType ===
                "DEPARTURE"
            )

        if (depObject) {

          const airport =
            findAerodromeAtWorldPosition(
              depObject.position,
              AERODROME_HIT_RADIUS /
              engine.scale
            )

        if (airport) {

          flightPlan.departure =
            airport

          notifyFlightPlanChanged()
        }

        await drawFlightPlan(
          engine,
          false
        )

        engine.draggedWaypointType =
          null
  
        engine.isDraggingWaypoint =
          false
  
        return        
      }
    }

    if (
      engine.draggedWaypointType ===
      "ARRIVAL"
    ) {

      const arrObject =
        objectLayer
          ?.getWaypointObjects()
          .find(
            wp =>
              wp.waypointType ===
              "ARRIVAL"
          )

      if (arrObject) {
        const airport =
          findAerodromeAtWorldPosition(
            arrObject.position,
            AERODROME_HIT_RADIUS /
            engine.scale
          )

        if (airport) {

          flightPlan.arrival =
            airport

          notifyFlightPlanChanged()
        }

        await drawFlightPlan(
          engine,
          false
        )

        engine.draggedWaypointType =
          null
  
        engine.isDraggingWaypoint =
          false
  
        return
      }
    }

    if (
      engine.isDraggingWaypoint &&
      engine.draggedWaypoint
    ) {
      const wpObject =
        objectLayer
          ?.getWaypointObjects()
          .find(
            wp =>
              wp.waypointId ===
              engine.draggedWaypoint!.id
          )

      if (wpObject) {

        const latLon =
          worldToLatLon(
            wpObject.position.x,
            wpObject.position.y
          )

        engine.draggedWaypoint.lat =
          latLon.lat

        engine.draggedWaypoint.lon =
          latLon.lon

        const airport =
          findAerodromeAtWorldPosition(
            wpObject.position,
            AERODROME_HIT_RADIUS /
            engine.scale
          )
          
        if (airport) {
          engine.draggedWaypoint.name =
            airport.name

          engine.draggedWaypoint.icao =
            airport.icao

          engine.draggedWaypoint.type =
            "AERODROME"
        } else {
          const index =
            flightPlan.waypoints.findIndex(
              wp =>
                wp.id ===
                engine.draggedWaypoint!.id
            )

            const name =
              latLon.lat.toFixed(2) +
              "/" +
              latLon.lon.toFixed(2)

            engine.draggedWaypoint.icao = 
              undefined            
            
            engine.draggedWaypoint.name = 
              `WP${index + 1}`
          
            engine.draggedWaypoint.type = 
              "USER"
          } 
      }

      engine.draggedWaypoint = null
      engine.isDraggingWaypoint = false

      await drawFlightPlan(
        engine,
        false
      )

      return
    }

    this.isDragging = false
    await engine.chartManager.update(engine)
  }
}