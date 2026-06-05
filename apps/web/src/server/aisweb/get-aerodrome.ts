'use server'

import { cache } from "react"
import { XMLParser } from "fast-xml-parser"

import { Aerodrome } from "./types"

interface AiswebResponse {
  aisweb: {
    AeroCode: string
    name: string
    city: string
    uf: string
    lat: string
    lng: string
  }
}

export const getAerodrome = cache(
  async (icaoCode: string): Promise<Aerodrome> => {

    const apiKey = "1639440789"  // process.env.AISWEB_API_KEY!
    const apiPassword = "cdcd55ea-2e97-11f1-a4e0-0050569ac2e1"  // process.env.AISWEB_API_PASSWORD!

    const params = new URLSearchParams({
      apiKey,
      apiPass: apiPassword,
      area: "rotaer",
      icaoCode: icaoCode.toUpperCase()
    })

    const response = await fetch(
      `http://aisweb.decea.mil.br/api/?${params.toString()}`
    )

    const xml = await response.text()

    const parser = new XMLParser()

    const result =
      parser.parse(xml) as AiswebResponse

    const airport = result.aisweb

    return {
      icao: airport.AeroCode,
      name: airport.name,
      city: airport.city,
      uf: airport.uf,
      lat: Number(airport.lat),
      lon: Number(airport.lng)
    }
  }
)