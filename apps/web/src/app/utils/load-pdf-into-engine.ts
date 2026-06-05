import { CanvasEngine } from "../engine/CanvasEngine"
import { ImageLayer } from "../engine/layers/ImageLayer"
import { calibrationToCrop } from "../utils/calibration-to-crop"
import { getChartCalibration } from "./get-chart-calibration"
import { createFlightLeg } from "@/server/aisweb/create-flight-leg"
import { testRoute } from "./test-route"

export async function loadPDFIntoEngine(
  url: string,
  engine: CanvasEngine
) {
const pdfjsLib = await import(
    "pdfjs-dist/legacy/build/pdf.mjs"
  )

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL(
      "pdfjs-dist/legacy/build/pdf.worker.mjs",
      import.meta.url
    ).toString()

  const pdfCanvas = document.createElement("canvas")
  const pdf = await pdfjsLib.getDocument(url).promise
  const page = await pdf.getPage(1)
  const pdfName = url.split("/").pop() ?? "unknown"
  const viewport = page.getViewport({ scale: 2 })

  pdfCanvas.width = viewport.width
  pdfCanvas.height = viewport.height

  await page.render({
    canvas: pdfCanvas,
    viewport
  }).promise


  const img = new Image()

  img.onload = async () => {
    const imageLayer = engine.getLayer<ImageLayer>("image")

    const calibration = getChartCalibration(pdfName)
      if (calibration) {
        const ppu = engine.getPixelsPerUnit()

        imageLayer?.setCrop({
            x: calibration.topLeft.x * ppu,
            y: calibration.topLeft.y * ppu,

            width:
            (calibration.bottomRight.x -
            calibration.topLeft.x) * ppu,

            height:
            (calibration.bottomRight.y -
            calibration.topLeft.y) * ppu
        })
      }
    
    imageLayer?.setImage(img)
    
    engine.render()

    await testRoute(engine)
  }

  img.src = pdfCanvas.toDataURL("image/png")
}

