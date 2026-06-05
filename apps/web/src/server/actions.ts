"use server"

import { getAerodrome } from
"@/server/aisweb/get-aerodrome"

export async function loadAirport(
  icao: string
) {
  
  return getAerodrome(icao)
}