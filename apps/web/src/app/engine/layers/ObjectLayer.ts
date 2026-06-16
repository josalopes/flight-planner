// layers/ObjectLayer.ts

import { CanvasLayer } from "../types/CanvasLayer"
import { CanvasEngine } from "../CanvasEngine"
import { GraphicObject } from "../objects/GraphicObject"
import { RouteObject } from "../objects/RouteObject"

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

  getRouteObjects() {
    return this.objects.filter(
      object =>
        object instanceof RouteObject
    ) as RouteObject[]
  }

  getAll() {
    return this.objects
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

