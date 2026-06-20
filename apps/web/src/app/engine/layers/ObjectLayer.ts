// layers/ObjectLayer.ts

import { CanvasLayer } from "../types/CanvasLayer"
import { CanvasEngine } from "../CanvasEngine"
import { GraphicObject } from "../objects/GraphicObject"
import { RouteObject } from "../objects/RouteObject"
import { WaypointObject } from "../objects/WaypointObject"
import { flightPlan } from "@/server/flight-plan/store"
import { latLonToWorld } from "@/app/utils/latlon-to-world"
import { Point } from "jspdf"

export class ObjectLayer implements CanvasLayer {
  id = "objects"
  visible = true
  isUI = false

  private objects: GraphicObject[] = []
    add(obj: GraphicObject) {
    this.objects.push(obj)
  }

  public clear() {
    this.objects = []
  }

  remove(obj: GraphicObject) {
    this.objects = this.objects.filter(o => o !== obj)
  }

  getObjects() {
    return this.objects
  }

  getWaypointObjects() {
  return this.objects.filter(
      object =>
        object instanceof WaypointObject
    )
  }

  getRouteObjects() {
    return this.objects.filter(
      object =>
        object instanceof RouteObject
    ) as RouteObject[]
  }

  getAll() {
    return this.objects
  }

  updateRouteObjects() {
    const routes =
      this.getRouteObjects()

    const points = [

      {
        lat: flightPlan.departure!.lat,
        lon: flightPlan.departure!.lon
      },

      ...flightPlan.waypoints.map(
        wp => ({
          lat: wp.lat,
          lon: wp.lon
        })
      ),

      {
        lat: flightPlan.arrival!.lat,
        lon: flightPlan.arrival!.lon
      }
    ]

    for (
      let i = 0;
      i < routes.length;
      i++
    ) {

      const start =
        latLonToWorld(
          points[i].lat,
          points[i].lon
        )

      const end =
        latLonToWorld(
          points[i + 1].lat,
          points[i + 1].lon
        )

      routes[i].start = start
      routes[i].end = end
    }
  }

  updateDeparturePreview(
    position: Point
  ) {

    const routes =
      this.getRouteObjects()

    if (routes.length === 0)
      return

    routes[0].start = {
      ...position
    }
  }

  updateArrivalPreview(
    position: Point
  ) {

    const routes =
      this.getRouteObjects()

    if (routes.length === 0)
      return

    routes[
      routes.length - 1
    ].end = {
      ...position
    }
  }

  clearSelection() {
    this.objects.forEach(o => (o.selected = false))
  }

  deleteSelected() {
    this.objects = this.objects.filter(o => !o.selected)
  }

  draw(ctx: CanvasRenderingContext2D, engine: CanvasEngine) {
    this.objects.forEach(obj => obj.draw(ctx, engine))
  }
}

