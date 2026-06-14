"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx";

import { 
    Banknote, 
    CalendarCheck2, 
    ChevronLeft, 
    ChevronDown,
    ChevronRight,
    Map, 
    Folder, 
    List, 
    Settings,
    UserPen,
    Users, Store,
    Warehouse,
    Feather
 } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"

import { Button } from "@/components/ui/button";

import { SidebarActionButton } from "./sidebar_action_button";
import { SidebarNavLink } from "./sidebar_nav_link";

import { Checkbox } from "@/components/ui/checkbox"
import { ChartLayer } from "@/app/engine/layers/ChartLayer";
import { loadChart } from "@/server/aisweb/load-chart";
import { ChartSelector } from "./chart-selector";


export function SidebarDashboardClient({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
              <ChartSelector />
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

        <main className="flex-1 py-4 px-2 md:p-6">
            {children}
        </main>
      </div>
    </div>
  )
}