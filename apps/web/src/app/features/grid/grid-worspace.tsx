"use client"

import { useState, useEffect, useRef } from "react"
import { useCanvasEngine } from "../../hooks/useCanvasEngine"
import { CanvasViewer } from "../../components/canvas-viewer"
import { GridLayer } from "../../engine/layers/GridLayer"
import { GridControls } from "../../components/grid-controls"
import { ImageLayer } from "../../engine/layers/ImageLayer"
import { CrosshairLayer } from "../../engine/layers/CrossHairLayer"
import { RulerLayer, RulerUnit } from "../../engine/layers/RulerLayer"
import { Move, Ruler, Undo2, Redo2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// import { loadPDF } from "../../../app/utils/load-pdf"
import { loadPDFIntoEngine } from "../../../app/utils/load-pdf-into-engine"

interface Props {
  label: string
  active: boolean
  onClick: () => void
}

export function ToolButton({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded ${
        active ? "bg-blue-600 text-white" : "bg-gray-200"
      }`}
    >
      {label}
    </button>
  )
}

export default function GridWorkspace() {
  /* ============================= */
  /* ========= STATES ============ */
  /* ============================= */

  const [spacing, setSpacing] = useState(1)
  const [thickness, setThickness] = useState(1)
  const [color, setColor] = useState("#000000")
  const [dpi, setDpi] = useState(96)
  const [paperSize, setPaperSize] = useState("A4")
  const [orientation, setOrientation] = useState("portrait")
  const [showSubdivisions, setShowSubdivisions] = useState(true)
  const [showMainGrid, setShowMainGrid] = useState(true)
  const [showCrosshair, setShowCrosshair] = useState(true)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { canvasRef, engine } = useCanvasEngine()

  const loadImage = (file: File) => {
    const img = new Image()

    img.onload = () => {
      const imageLayer = engine.current?.getLayer<ImageLayer>("image")
      if (!imageLayer) return

      imageLayer.setImage(img)
      engine.current?.render()
    }

    img.src = URL.createObjectURL(file)
  }
  
  const toggleCrosshair = () => {
    const layer = engine.current?.getLayer<CrosshairLayer>("crosshair")
    if (!layer) return
    layer.visible = !layer.visible
    engine.current?.render()
    setShowCrosshair(!showCrosshair)
  }

  const handleUnitChange = (unit: RulerUnit) => {
    // const ruler = engine.current?.getLayer<RulerLayer>("ruler")
    if (!engine.current) return

    engine.current.unit = unit
    engine.current?.render()
  }

  /* ============================= */
  /* ===== GRID CONFIG UPDATE ==== */
  /* ============================= */

  useEffect(() => {
    const eng = engine.current
    if (!eng) return

    const gridLayer = eng.getLayer<GridLayer>("grid")
    if (!gridLayer) return

    gridLayer.spacingUnits = spacing
    eng.render()

    gridLayer.color = color
    gridLayer.thickness = thickness
    gridLayer.showMainGrid = showMainGrid
    gridLayer.showSubdivisions = showSubdivisions

    eng.render()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    spacing,
    thickness,
    color,
    dpi,
    showMainGrid,
    showSubdivisions
  ])

  async function handleLoadMap() {
    if (!engine.current) return

    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/belo-horizonte_wac_20240516.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/recife_wac_20251225.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/fortaleza_wac_20241031.pdf"
    const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/salvador_wac_20240808.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/brasilia---em-vigor-em-25-jan-24-_wac_20240125.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/sao-luis---em-vigor-25-jan-24_wac_20240125.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/itaituba---em-vigor-25-jan-24_wac_20240125.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/porto-nacional_wac_20240516.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/goiania_wac_20240516.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/curitiba_wac_20240516.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/imperatriz_wac_20240711.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/campo-grande_wac_20240808.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/uruguaiana_wac_20240808.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/belem_wac_20241031.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/santarem_wac_20241031.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/tarauaca_wac_20241031.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/corumba_wac_20241031.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/rio-da-prata_wac_20241031.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/cruzeiro-do-sul_wac_20241128.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/natal_wac_20241128.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/boa-vista_wac_20241226.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/tumucumaque_wac_20241226.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/macapa_wac_20241226.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/bela-vista_wac_20241226.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/porto-alegre_wac_20250612.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/petrolina_wac_20250710.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/ji-parana_wac_20250710.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/principe-da-beira_wac_20250710.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/foz-do-iguacu-_wac_20250710.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/cabo-orange_wac_20250807.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/monte-roraima_wac_20250807.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/sao-paulo_wac_20250807.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/serra-pacaraima_wac_20250807.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/rondonopolis_wac_20251002.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/sao-gabriel-da-cachoeira_wac_20251030.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/aragarcas_wac_20251030.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/rio-de-janeiro_wac_20251030.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/humaita_wac_20251127.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/fernando-de-noronha_wac_20251127.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/cachimbo_wac_20251127.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/cuiaba_wac_20251127.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/pico-da-neblina_wac_20251225.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/manaus_wac_20251225.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/tabatinga_wac_20251225.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/teresina_wac_20251225.pdf"
    // const url = "https://aisweb.decea.mil.br/cartas/visuais/wac/porto-velho_wac_20251225.pdf"
    await loadPDFIntoEngine(url, engine.current)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col">
        {/* 🔝 TOOLBAR FIXA */}
        <div className="top-0 left-0 right-0 h-24 bg-gray-400 shadow flex items-center px-6 gap-6">
          <select
            onChange={(e) => {
              handleUnitChange(e.target.value as RulerUnit)
            }}
          >
            <option value="cm">Centímetros</option>
            <option value="mm">Milímetros</option>
            <option value="in">Polegadas</option>
            <option value="px">Pixels</option>
          </select>

          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
          </select>

          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="portrait">Retrato</option>
            <option value="landscape">Paisagem</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showMainGrid}
              onChange={(e) => setShowMainGrid(e.target.checked)}
            />
            Grid Principal
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showSubdivisions}
              onChange={(e) => setShowSubdivisions(e.target.checked)}
            />
            Subdivisão mm
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showCrosshair}
              onChange={toggleCrosshair}
            />
            Crosshair
          </label>

          {/* Upload imagem */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Carregar Imagem
          </button>
          
          {/* Upload mapa */}
          <button
            onClick={handleLoadMap}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Carregar mapa
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={e => {
            if (!e.target.files?.[0]) return
            loadImage(e.target.files[0])
          }}
            className="hidden"
          />

          <button
            onClick={() =>
              engine.current?.exportPNG()
            }
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Exportar PNG
          </button>
          
          <button
            onClick={() =>
              engine.current?.exportPDF("a4", "portrait")
            }
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Exportar PDF
          </button>

          <button
            onClick={() => engine.current?.clear()}
            className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded transition"
          >
            Limpar Canvas
          </button>
        </div>

        <div className="py-2">
          <Separator />
        </div>


        <div className="left-0 right-0 h-14 bg-white shadow flex items-center gap-4 px-6">
          <ToolButton
            label="Select"
            active={engine.current?.getActiveToolId() === "select"}
            onClick={() => engine.current?.setTool("selection")}
          />
          
          <ToolButton
            label="Pan"
            active={engine.current?.getActiveToolId() === "pan"}
            onClick={() => engine.current?.setTool("pan")}
          />

          <ToolButton
            label="Distance"
            active={engine.current?.getActiveToolId() === "distance"}
            onClick={() => engine.current?.setTool("distance")}
          />

          <button onClick={() => engine.current?.undo()}>
            Undo
          </button>

          <button onClick={() => engine.current?.redo()}>
            Redo
          </button>
        </div>
    </div>

      {/* CONTEÚDO */}
      <div className="ml-8 pt-24 flex gap-8 px-8">
        <GridControls
          spacing={spacing}
          setSpacing={setSpacing}
          thickness={thickness}
          setThickness={setThickness}
          color={color}
          setColor={setColor}
          dpi={dpi}
          setDpi={setDpi}
        />

        <div className="flex-1">
          <CanvasViewer
            canvasRef={canvasRef}
          />
        </div>
      </div>
    </div>
  )
}

