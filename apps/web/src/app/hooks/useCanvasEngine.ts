import { useEffect, useRef } from "react"
import { CanvasEngine } from "../engine/CanvasEngine"
import { ImageLayer } from "../engine/layers/ImageLayer"
import { CrosshairLayer } from "../engine/layers/CrossHairLayer"
import { HudLayer } from "../engine/layers/HudLayer"
import { DistanceTool } from "../engine/tools/DistanceTool"
import { PanTool } from "../engine/tools/PanTool"
import { SelectionTool } from "../engine/tools/SelectionTool"
import { ObjectLayer } from "../engine/layers/ObjectLayer"
import { BaseMapLayer } from "../engine/layers/BaseMapLayer"
import { BASEMAP_EXTENT } from "@/server/flight-plan/types"
import { useCanvasEngineContext } from "../contexts/canvas-engine-context"
import { AerodromeHoverLayer } from "../engine/layers/AerodromeHoverLayer"
import { MeasureTool } from "../engine/tools/MeasureTool"

export function useCanvasEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<CanvasEngine | null>(null)
  const {setEngine} = useCanvasEngineContext()
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const engine = new CanvasEngine(canvasRef.current)
    engineRef.current = engine
    setEngine(engine)
    
    // ===== LAYERS =====
    const baseMapLayer = new BaseMapLayer()

    const img = new Image()
    img.onload = () => {
      baseMapLayer.setImage(img)
      
      canvasRef.current!.width =
        canvasRef.current!.clientWidth

      canvasRef.current!.height =
        canvasRef.current!.clientHeight
      

      engine.fitExtent(
        BASEMAP_EXTENT.west,
        BASEMAP_EXTENT.south,
        BASEMAP_EXTENT.east,
        BASEMAP_EXTENT.north
      )

      engine.render()
    }

    img.src = "/maps/brasil_osm_geo.png"
    
    const aerodromeHoverLayer = new AerodromeHoverLayer()
    const imageLayer = new ImageLayer()
    const objectLayer = new ObjectLayer()
    const crosshairLayer = new CrosshairLayer()
    const hudLayer = new HudLayer()

    engine.addLayerAt(0, baseMapLayer)
    engine.addLayer(imageLayer)
    engine.addLayer(objectLayer)
    engine.addLayer(crosshairLayer)
    engine.addLayer(aerodromeHoverLayer)
    engine.addLayer(hudLayer)

    // ===== TOOLS =====
    const distanceTool = new DistanceTool()
    const measureTool = new MeasureTool()
    const panTool = new PanTool()
    const selectTool = new SelectionTool()
    
    engine.registerTool(distanceTool)
    engine.registerTool(measureTool)
    engine.registerTool(panTool)
    engine.registerTool(selectTool)

    engine.setTool("pan") // opcional default
    
    engineRef.current = engine
    engine.render()
  }, [])

  return { canvasRef, engine: engineRef }
}