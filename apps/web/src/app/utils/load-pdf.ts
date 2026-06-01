import * as pdfjsLib from "pdfjs-dist"
import { CanvasEngine } from "../engine/CanvasEngine"
import { ImageLayer } from "../engine/layers/ImageLayer"

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString()

export async function loadPDFIntoEngine(
  url: string, 
  engine: CanvasEngine
) {
  const pdfCanvas = document.createElement("canvas")
  
  const pdf = await pdfjsLib.getDocument(url).promise
  const page = await pdf.getPage(1)

  const viewport = page.getViewport({ scale: 2 })

  pdfCanvas.width = viewport.width
  pdfCanvas.height = viewport.height

  await page.render({
    canvas: pdfCanvas,
    viewport
  }).promise

  const img = new Image()

  img.onload = () => {
    const imageLayer =
      engine.getLayer<ImageLayer>("image")

    imageLayer?.setImage(img)

    engine.render()
  }

  img.src = pdfCanvas.toDataURL("image/png")
}