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

  const [tick, setTick] = useState(0)

  const [
    engine,
    setEngine
  ] = useState<
    CanvasEngine | null
  >(null)

  const refreshCanvasStatus =
    () => setTick(
      value => value + 1
    )

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