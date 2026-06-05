interface Point {
  x: number
  y: number
}

export function getBearing(start: Point, end: Point) {
    const dx = end.x - start.x
    const dy = end.y - start.y

    let angle =
      Math.atan2(dx, -dy)
        * 180
        / Math.PI

    if (angle < 0) {
      angle += 360
    }

    return angle
  }

  export function bearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const φ1 =
    lat1 * Math.PI / 180

  const φ2 =
    lat2 * Math.PI / 180

  const λ1 =
    lon1 * Math.PI / 180

  const λ2 =
    lon2 * Math.PI / 180

  const y =
    Math.sin(λ2 - λ1) *
    Math.cos(φ2)

  const x =
    Math.cos(φ1) *
    Math.sin(φ2)
    -
    Math.sin(φ1) *
    Math.cos(φ2) *
    Math.cos(λ2 - λ1)

  const brng =
    Math.atan2(y, x)

  return (
    (brng * 180 / Math.PI) +
    360
  ) % 360
}