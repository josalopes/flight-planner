"use client"

import { useState } from "react"

import { useCanvasEngineContext } from "@/app/contexts/canvas-engine-context"
import { ChartLayer } from "@/app/engine/layers/ChartLayer"
import { CHART_CATALOGUE } from "@/data/chart-catalogue"
import { loadChart } from "@/server/aisweb/load-chart"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function ChartSelector() {
  const [open, setOpen] = useState(false)
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const { engine } = useCanvasEngineContext()
  const allChartsSelected = selectedCharts.length === CHART_CATALOGUE.length

  async function handleToggle(
    chartId: string,
    checked: boolean
  ) {
    if (!engine)
      return

    if (checked) {
      setSelectedCharts(
        state => [
          ...state,
          chartId
        ]
      )

      const chart =
        CHART_CATALOGUE.find(
          c => c.id === chartId
        )

      if (!chart)
        return

      if (
        engine.getLayer(
          `chart-${chart.id}`
        )
      ) {
        return
      }

      const layer = new ChartLayer(chart)
      engine.addLayerAt(1, layer)

      const image = await loadChart(chart)

      layer.setImage(image)
      
      engine.zoomToChart(chart, 0.6)
    } else {
      setSelectedCharts(
        state =>
          state.filter(
            id =>
              id !== chartId
          )
      )

      engine.removeLayer(
        `chart-${chartId}`
      )

      const remainingCharts =
        CHART_CATALOGUE.filter(
          chart =>
            selectedCharts.includes(
              chart.id
            ) &&
            chart.id !== chartId
        )

      if (
        remainingCharts.length === 0
      ) {
        engine.resetToBaseMap()
      } else {
        engine.fitCharts(
          remainingCharts
        )
      }  

      if (
        !engine.hasChartLayers()
      ) {
        engine.resetToBaseMap()
      }
    }

    engine.render()
  }

  async function handleToggleAll(
    checked: boolean
  ) {
    if (!engine) return

    if (checked) {
      setSelectedCharts(
        CHART_CATALOGUE.map(
          chart => chart.id
        )
      )

      for (
        const chart
        of CHART_CATALOGUE
      ) {
        if (
          engine.getLayer(
            `chart-${chart.id}`
          )
        ) {
          continue
        }

        const layer = new ChartLayer(chart)
        engine.addLayerAt(1, layer)

        const image = await loadChart(chart)
        layer.setImage(image)
      }      
    } else {
      setSelectedCharts([])
      
      for (
        const chart
        of CHART_CATALOGUE
      ) {
        const layer =
          engine.getLayer(
            `chart-${chart.id}`
          ) as ChartLayer

        if (
          layer?.isRouteChart
        ) {
          continue
        }

        engine.removeLayer(
          `chart-${chart.id}`
        )
      }

      // setSelectedCharts([])

      engine.resetToBaseMap()
    }
    engine.render()
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger
        className="
          flex
          items-center
          justify-between
          w-full
          px-2
          py-2
          rounded-md
          hover:bg-accent
        "
      >

        <span>
          Cartas WAC
        </span>

        {
          open
            ? <ChevronDown className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />
        }
      </CollapsibleTrigger>


      <CollapsibleContent>
        <div className="flex items-center gap-2 mb-2">
          <Checkbox
            checked={allChartsSelected}
            onCheckedChange={
              handleToggleAll
            }
          />

          <span>
            Todas
          </span>
        </div>
        <hr className="mb-2" />

        <div className="flex flex-col gap-2 mt-2">
          {          
            [...CHART_CATALOGUE]
              .sort(
                (a, b) =>
                  a.name.localeCompare(
                    b.name,
                    "pt-BR"
                  )
              )
            .map((chart) => {
            const existingLayer =
              engine?.getLayer(
                `chart-${chart.id}`
              ) as ChartLayer | undefined

            const isRouteChart =
              existingLayer?.isRouteChart ?? false

            return (
              <div
                key={chart.id}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={
                    selectedCharts.includes(
                      chart.id
                    ) || isRouteChart
                  }
                  disabled={isRouteChart}
                  onCheckedChange={(checked) =>
                    handleToggle(
                      chart.id,
                      checked === true
                    )
                  }
                />

                <span
                  className={
                    isRouteChart
                      ? "opacity-60"
                      : ""
                  }
                >
                  {chart.id} {chart.name}
                </span>

              </div>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}