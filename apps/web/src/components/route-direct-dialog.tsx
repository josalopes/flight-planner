"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Aerodrome } from "@/server/aisweb/get-all-aerodromes"

import {
  AerodromeSearchInput
} from "./aerodrome-search-input"

interface RouteDirectDialogProps {
  open: boolean
  onOpenChange: (
    open: boolean
  ) => void

  onCreate: (
    departure: Aerodrome,
    arrival: Aerodrome
  ) => Promise<void>
}

export function RouteDirectDialog({
  open,
  onOpenChange,
  onCreate
}: RouteDirectDialogProps) {

  const [
    departure,
    setDeparture
  ] = useState<Aerodrome | null>(
    null
  )

  const [
    arrival,
    setArrival
  ] = useState<Aerodrome | null>(
    null
  )

  async function handleCreate() {

    if (!departure) return
    if (!arrival) return

    await onCreate(
      departure,
      arrival
    )

    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Nova rota direta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <AerodromeSearchInput
            label="Departure"
            value={departure}
            onSelect={
              setDeparture
            }
          />

          <AerodromeSearchInput
            label="Arrival"
            value={arrival}
            onSelect={
              setArrival
            }
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancelar
          </Button>

          <Button
            onClick={handleCreate}
            disabled={
              !departure ||
              !arrival
            }
          >
            Criar rota
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}