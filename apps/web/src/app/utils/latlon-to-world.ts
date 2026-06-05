interface WorldPoint {
  x: number
  y: number
}

export function latLonToWorld(
  lat: number,
  lon: number
) {

  return {
    x: lon * 1000,
    y: -lat * 1000
  }
}
