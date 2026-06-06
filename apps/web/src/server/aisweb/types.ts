export interface Aerodrome {
  icao: string
  name: string
  city: string
  uf: string
  lat: number
  lon: number
}

export interface Waypoint {
  icao: string
  name: string
  lat: number
  lon: number
}

export interface FlightLeg {
  origin: Aerodrome
  destination: Aerodrome

  distanceNM: number
  trueCourse: number
}

export interface ChartBounds {
  north: number
  south: number

  west: number
  east: number
}

export interface ControlPoint {
  lat: number
  lon: number

  x: number
  y: number
}

export interface ChartGeoref {
  controlPoints: ControlPoint[]
}

export interface ChartMetadata {
  id: string
  name: string

  imageUrl: string

  width: number
  height: number

  west: number
  east: number

  north: number
  south: number

  crs: string

  pixelSizeX: number
  pixelSizeY: number

  nativeResolution: "standard" | "high"
}

export function expandBounds(
  bounds: {
    left:number
    top:number
    right:number
    bottom:number
  },
  margin:number
) {
  return {
    left: bounds.left - margin,
    top: bounds.top - margin,
    right: bounds.right + margin,
    bottom: bounds.bottom + margin
  }
}

