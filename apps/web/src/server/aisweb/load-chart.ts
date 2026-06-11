import { ImageLayer } from "@/app/engine/layers/ImageLayer"
import { ChartMetadata } from "./types"

export async function loadChart(
  chart: ChartMetadata
): Promise<HTMLImageElement> {

  return new Promise(
    (resolve) => {

      const img = new Image()

      img.onload = () =>
        resolve(img)

      img.src =
        chart.imageUrl

    }
  )
}