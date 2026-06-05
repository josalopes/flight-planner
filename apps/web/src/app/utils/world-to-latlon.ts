export function worldToLatLon(
  x: number,
  y: number
) {
  return {
    lat: -y / 1000,
    lon: x / 1000
  }
}