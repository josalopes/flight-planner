interface Point {
  x: number
  y: number
}

export function getDistance(start: Point, end: Point) {
    const dx = end.x - start.x
    const dy = end.y - start.y

    return Math.hypot(dx, dy)
  }

  export function haversineNm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371 // km

  const dLat =
    (lat2 - lat1) *
    Math.PI / 180

  const dLon =
    (lon2 - lon1) *
    Math.PI / 180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )

  const km = R * c

  return km / 1.852
}