"use client";

import { useState } from "react";
import clsx from "clsx";

import { 
    ChevronLeft, 
    ChevronRight,
    List
     } from "lucide-react";

import {
    Sheet,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    Collapsible,
    CollapsibleContent} from "@/components/ui/collapsible"

import { Button } from "@/components/ui/button";


import { ChartSelector } from "../app/(panel)/_components/chart-selector";
import { RoutePanel } from "./route-panel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useCanvasEngineContext } from "@/app/contexts/canvas-engine-context";
import { StatusBar } from "@/app/components/Canvas/StatusBar";


export function SidebarDashboardClient({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { engine } = useCanvasEngineContext()
  const [
    selectedRegion,
    setSelectedRegion
  ] = useState("Todas")

  const setRegion =
    (region: string) => {
      if (!engine) {
        return
      }

      engine.aerodromeFilter.region =
        region

      setSelectedRegion(region)  

      engine.render()
    }


  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full", {
          "w-20": isCollapsed,
          "w-64": !isCollapsed,
          "hidden md:flex md:fixed": true
          })}
      >

        <Button
            className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            {!isCollapsed ? <ChevronLeft className="w-12 h-12"/> : <ChevronRight className="w-12 h-12"/>}
        </Button>

        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
          <div
            className="
              flex
              flex-col
              gap-2
              mt-2
              max-h-[60vh]
              overflow-y-auto
              pr-2
            "
          >
            <ChartSelector />

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
              >
                <Button
                  variant="outline"
                  size="sm"
                >
                  Região:
                  {" "}
                  {selectedRegion}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    setRegion("Todas")
                  }
                >
                  Todas
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setRegion("Norte")
                  }
                >
                  Norte
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setRegion("Nordeste")
                  }
                >
                  Nordeste
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setRegion("Centro-Oeste")
                  }
                >
                  Centro-Oeste
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setRegion("Sudeste")
                  }
                >
                  Sudeste
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setRegion("Sul")
                  }
                >
                  Sul
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <RoutePanel />
          </div>
          </CollapsibleContent>
        </Collapsible>
      </aside>

      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
          "md:ml-20": isCollapsed,
          "md:ml-64": !isCollapsed
        })}>

        <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white">
          <Sheet>
            <div className="flex items-center gap-4">
                <SheetTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="md:hidden"
                        onClick={() => setIsCollapsed(false)}
                    >
                        <List className="w-5 h-5"/>
                    </Button>
                </SheetTrigger>

                <h1 className="text-base md:text-lg font-semibold">
                    Menu Flight Planner
                </h1>
            </div>
          </Sheet> 
        </header>

        <main className="flex-1 min-h-0 p-0">
            {children}
        </main>
        <StatusBar />
      </div>
    </div>
  )
}