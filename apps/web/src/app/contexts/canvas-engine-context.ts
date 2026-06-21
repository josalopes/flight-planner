"use client"

import {
  createContext,
  useContext
} from "react"

import { CanvasEngine }
from "@/app/engine/CanvasEngine"

interface CanvasEngineContextData {
  engine:
    CanvasEngine | null

  setEngine: (
    engine: CanvasEngine
  ) => void
}

export const CanvasEngineContext =
  createContext(
    {} as CanvasEngineContextData
  )

export function useCanvasEngineContext() {
  return useContext(
    CanvasEngineContext
  )
}