"use client"

import {
  ReactNode,
  useState
} from "react"

import { CanvasEngine }
from "@/app/engine/CanvasEngine"

import {
  CanvasEngineContext
} from "./canvas-engine-context"

interface Props {
  children: ReactNode
}

export function CanvasEngineProvider({
  children
}: Props) {

  const [
    engine,
    setEngine
  ] = useState<
    CanvasEngine | null
  >(null)

  return (

    <CanvasEngineContext.Provider
      value={{
        engine,
        setEngine
      }}
    >

      {children}

    </CanvasEngineContext.Provider>
  )
}