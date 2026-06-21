"use client"

import { useMemo, useState } from "react"

import aerodromes
  from "@/data/aerodromes.json"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"

import { Button } from "@/components/ui/button"

import { Aerodrome }
  from "@/server/aisweb/get-all-aerodromes"

interface Props {
  label: string
  value: Aerodrome | null
  onSelect: (
    airport: Aerodrome
  ) => void
}

export function AerodromeSearchInput({
  label,
  value,
  onSelect
}: Props) {

  const airports =
    useMemo(
      () =>
        aerodromes as Aerodrome[],
      []
    )

  const [search, setSearch] = useState("") 
  const [open, setOpen] = useState(false)
  
  const filteredAirports =
  useMemo(() => {

    const q =
      search
        .trim()
        .toLowerCase()

    if (!q)
      return airports

    return airports.filter(
      airport =>
        airport.icao
          .toLowerCase()
          .includes(q) ||

        airport.city
          .toLowerCase()
          .includes(q) ||

        airport.name
          .toLowerCase()
          .includes(q) ||

        airport.uf
          ?.toLowerCase()
          .includes(q)
    )

  }, [
    airports,
    search
  ])

  return (
    <div>
      <div className="mb-2 text-sm font-medium">
        {label}
      </div>

      <Popover
            open={open}
            onOpenChange={value => {

                setOpen(value)

                if (!value) {
                setSearch("")
                }

            }}
        >

        <PopoverTrigger
          asChild
        >
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            {value
              ? `${value.icao} - ${value.city}`
              : "Selecionar aeródromo"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[420px] p-0"
        >

          <Command>
            
          <CommandInput
            placeholder="ICAO, cidade ou aeroporto..."
            value={search}
            onValueChange={setSearch}
          />

            <CommandList>
                {filteredAirports
                  .slice(0, 50)
                  .map(
                    airport => (
                    <CommandItem
                        key={airport.icao}
                        value={`
                        ${airport.icao}
                        ${airport.city}
                        ${airport.name}
                        ${airport.uf}
                        `}
                        onSelect={() => {
                            onSelect(airport)                          
                            setOpen(false)                          
                            setSearch("")                          
                          }}
                    >
                        <div className="flex flex-col">
                            <span>
                                {airport.icao}
                                {" - "}
                                {airport.city}
                                {airport.uf
                                ? `/${airport.uf}`
                                : ""}
                            </span>

                            <span
                                className="
                                text-xs
                                text-muted-foreground
                                "
                            >
                                {airport.name}
                            </span>
                        </div>
                    </CommandItem>
                    )
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}