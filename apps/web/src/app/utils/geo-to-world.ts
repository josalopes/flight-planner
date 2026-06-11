export function geoToWorld(
  lat: number,
  lon: number
) {
  return {
    x: lon * 1000,
    y: -lat * 1000
  }
}