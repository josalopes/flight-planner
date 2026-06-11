import { CanvasLayer } from "../types/CanvasLayer"
import { CanvasEngine } from "../CanvasEngine"
import { geoToWorld } from "@/app/utils/geo-to-world"
import { BASEMAP_EXTENT } from "@/server/flight-plan/types"

export class BaseMapLayer
  implements CanvasLayer {

  id = "basemap"

  visible = true

  isUI = false

  private image:
    HTMLImageElement | null = null

  setImage(
    image: HTMLImageElement
  ) {
    this.image = image
  }

  draw(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine
  ) {
    if (!this.image)
      return


    const west =
      BASEMAP_EXTENT.west
    // const west =
    //   -102.83338516900395

    const east =
      BASEMAP_EXTENT.east
    // const east =
    //   -15.288304326921406

    const north =
      BASEMAP_EXTENT.north
    // const north =
    //   13.892226934561162

    const south =
      BASEMAP_EXTENT.south
    // const south =
    //   -42.16181763339097

    const nw =
      geoToWorld(
        north,
        west
      )

    const se =
      geoToWorld(
        south,
        east
      )

    const x =
      west * 1000

    const y =
      -north * 1000

    const width =
      (east - west) * 1000

    const height =
      (north - south) * 1000

    ctx.save()

    ctx.globalAlpha = 0.5

    ctx.drawImage(
      this.image,
      nw.x,
      nw.y,
      se.x - nw.x,
      se.y - nw.y
    )

    ctx.restore()
  }
}

