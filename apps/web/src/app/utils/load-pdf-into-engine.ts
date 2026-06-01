import { CanvasEngine } from "../engine/CanvasEngine"
import { ImageLayer } from "../engine/layers/ImageLayer"
import { calibrationToCrop } from "../utils/calibration-to-crop"

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
  const ppu = engine.getPixelsPerUnit()

  img.onload = () => {
    const imageLayer = engine.getLayer<ImageLayer>("image")
    
    imageLayer?.setImage(img)

    // imageLayer?.setCrop(null)

    const saved = localStorage.getItem(
      `chart:${pdfName}`
    )

    if (saved) {
      const calibration = JSON.parse(saved) as ChartCalibration
    }
    
    const calibration: ChartCalibration = {
      topLeft: {
        x: 19.55,
        y: 1.95
      },

      bottomRight: {
        x: 120.95,
        y: 70.80
      },  
    }


    const ppu = engine.getPixelsPerUnit()

    const crop =
      calibrationToCrop(
        calibration,
        engine.getPixelsPerUnit()
    )

    imageLayer?.setCrop(crop)

    localStorage.setItem(
      `chart:${pdfName}`,
      JSON.stringify(calibration)
    )

    engine.render()
  }

  img.src = pdfCanvas.toDataURL("image/png")
}