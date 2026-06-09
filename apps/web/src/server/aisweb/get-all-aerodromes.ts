'use server'

import { cache } from "react"
import { XMLParser } from "fast-xml-parser"

export interface Aerodrome {
  icao: string
  name: string
  city: string
  uf: string
  lat: number
  lon: number
}

interface AiswebResponse {
  aisweb: {
    rotaer: {
      item: Array<{
        AeroCode: string
        name: string
        city: string
        uf: string
        lat: string
        lng: string
        type: string
      }>
    }
  }
}

export const getAllAerodromes = cache(
  async (): Promise<Aerodrome[]> => {

    const apiKey = "1639440789"
    const apiPassword =
      "cdcd55ea-2e97-11f1-a4e0-0050569ac2e1"

    const params =
      new URLSearchParams({
        apiKey,
        apiPass: apiPassword,
        area: "rotaer"
      })

    const response =
      await fetch(
        `http://aisweb.decea.mil.br/api/?${params.toString()}`
      )

    const xml = await response.text()

    const parser = new XMLParser()

    const result = parser.parse(xml) as AiswebResponse
//
    console.log(result.aisweb.rotaer.item.length)

    const items = result.aisweb.rotaer.item

    console.log(
      items[0].AeroCode,
      items[items.length - 1].AeroCode,
      items.length
    )

    console.log(
      Object.keys(
          result.aisweb.rotaer
      )
    )
//
   const aerodromes =
    result.aisweb.rotaer.item
        .filter(
        item =>
            item.type === "AD"
        )
        .map(
        item => ({
            icao: item.AeroCode,
            name: item.name,
            city: item.city,
            uf: item.uf,
            lat: Number(item.lat),
            lon: Number(item.lng)
        })
    )
  }
)