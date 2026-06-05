// src/lib/navigation/initial-bearing.ts

function toRad(degrees: number) {
  return degrees * Math.PI / 180
}

function toDeg(radians: number) {
  return radians * 180 / Math.PI
}

export function initialBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)

  const λ1 = toRad(lon1)
  const λ2 = toRad(lon2)

  const y =
    Math.sin(λ2 - λ1) * Math.cos(φ2)

  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) *
      Math.cos(φ2) *
      Math.cos(λ2 - λ1)

  const θ = Math.atan2(y, x)

  return (toDeg(θ) + 360) % 360
}