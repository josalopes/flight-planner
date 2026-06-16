import { CanvasEngine } from "../CanvasEngine"
import { GraphicObject } from "./GraphicObject"

interface Point {
  x: number
  y: number
}

export class WaypointObject
  implements GraphicObject {

  id = crypto.randomUUID()
  type = "waypoint"
  selected = false

  constructor(
    public position: Point,
    public label: string,
    public waypointType:
      | "AERODROME"
      | "USER"
      | "DEPARTURE"
      | "ARRIVAL",
    public waypointId: string
  ) {}

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {
      ctx.save()

      const size = 8 / engine.scale

      // ======================
      // LOSANGO
      // ======================

      ctx.beginPath()

      if (
      this.waypointType ===
      "AERODROME"
      ) {

      // =====================
      // QUADRADO
      // =====================

          ctx.rect(
              this.position.x - size,
              this.position.y - size,
              size * 2,
              size * 2
          )

      } else {

    // =====================
    // LOSANGO
    // =====================

      ctx.moveTo(
          this.position.x,
          this.position.y - size
      )

      ctx.lineTo(
          this.position.x + size,
          this.position.y
      )

      ctx.lineTo(
          this.position.x,
          this.position.y + size
      )

      ctx.lineTo(
          this.position.x - size,
          this.position.y
      )

      ctx.closePath()
    }

    if (
      this.waypointType ===
      "DEPARTURE"
    ) {

      ctx.fillStyle = "#0066ff"

    } else if (
      this.waypointType ===
      "ARRIVAL"
    ) {

      ctx.fillStyle = "#ff0000"

    } else {

      ctx.fillStyle =
        this.selected
          ? "#ff0000"
          : "#00aa00"

    }

    ctx.fill()

    // ======================
    // LABEL
    // ======================

    ctx.font = `${12 / engine.scale}px Arial`

    ctx.fillStyle = "#000"

    ctx.textAlign = "left"

    ctx.textBaseline = "middle"

    ctx.fillText(
      this.label,
      this.position.x + 12 / engine.scale,
      this.position.y
    )

    const hovered =
        engine.hoveredWaypoint?.id ===
        this.waypointId

    if (hovered) {
        ctx.save()

        ctx.font = `${12 / engine.scale}px Arial`

        const padding = 6 / engine.scale

        const textWidth =
            ctx.measureText(
            this.label
            ).width

        const width =
            textWidth +
            padding * 2

        const height = 22 / engine.scale

        const x = this.position.x

        const y =
            this.position.y -
            30 / engine.scale

        ctx.fillStyle = "rgba(0,0,0,0.85)"

        ctx.beginPath()

        ctx.roundRect(
            x,
            y,
            width,
            height,
            4 / engine.scale
        )

        ctx.fill()

        ctx.fillStyle =
            "#ffffff"

        ctx.textBaseline =
            "middle"

        ctx.fillText(
            this.label,
            x + padding,
            y + height / 2
        )

        ctx.restore()
    }

    ctx.restore()
  }

  hitTest(
    point: Point,
    tolerance: number
  ): boolean {

    return (
      Math.hypot(
        point.x - this.position.x,
        point.y - this.position.y
      ) <= tolerance
    )
  }

  move(
    dx: number,
    dy: number
  ) {

    this.position.x += dx
    this.position.y += dy
  }

  getBounds(): DOMRect {
    return new DOMRect(
      this.position.x - 10,
      this.position.y - 10,
      20,
      20
    )
  }
}