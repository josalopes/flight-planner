import { useEffect, useRef } from "react"
import { CanvasEngine } from "../engine/CanvasEngine"
import { ImageLayer } from "../engine/layers/ImageLayer"
import { CrosshairLayer } from "../engine/layers/CrossHairLayer"
import { HudLayer } from "../engine/layers/HudLayer"
import { DistanceTool } from "../engine/tools/DistanceTool"
import { PanTool } from "../engine/tools/PanTool"
import { SelectionTool } from "../engine/tools/SelectionTool"
import { ObjectLayer } from "../engine/layers/ObjectLayer"

export function useCanvasEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<CanvasEngine | null>(null)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const engine = new CanvasEngine(canvasRef.current)
    
    // ===== LAYERS =====
    const imageLayer = new ImageLayer()
    const objectLayer = new ObjectLayer()
    const crosshairLayer = new CrosshairLayer()
    const hudLayer = new HudLayer()
    
    engine.addLayer(imageLayer)
    engine.addLayer(objectLayer)
    engine.addLayer(crosshairLayer)
    engine.addLayer(hudLayer)

    // ===== TOOLS =====
    const distanceTool = new DistanceTool()
    const panTool = new PanTool()
    const selectTool = new SelectionTool()
    
    engine.registerTool(distanceTool)
    engine.registerTool(panTool)
    engine.registerTool(selectTool)

    engine.setTool("pan") // opcional default
    
    engineRef.current = engine
    engine.render()
  }, [])

  return { canvasRef, engine: engineRef }
}