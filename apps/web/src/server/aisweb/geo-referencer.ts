import { ChartGeoref, ControlPoint } from "./types"

export class Georeferencer {
  constructor(
    private calibration: ChartGeoref
  ) {}

  latLonToWorld(
    lat: number,
    lon: number
  ) {
    const points =
      this.calibration.controlPoints

    const lats =
      [...new Set(
        points.map(p => p.lat)
      )]
      .sort((a, b) => b - a)

    const lons =
      [...new Set(
        points.map(p => p.lon)
      )]
      .sort((a, b) => a - b)

    let northLat: number | null = null
    let southLat: number | null = null

    for (let i = 0; i < lats.length - 1; i++) {
      if (
        lat <= lats[i]
        &&
        lat >= lats[i + 1]
      ) {
        northLat = lats[i]
        southLat = lats[i + 1]
        break
      }
    }

    let westLon: number | null = null
    let eastLon: number | null = null

    for (let i = 0; i < lons.length - 1; i++) {
      if (
        lon >= lons[i]
        &&
        lon <= lons[i + 1]
      ) {
        westLon = lons[i]
        eastLon = lons[i + 1]
        break
      }
    }

    if (
      northLat === null ||
      southLat === null ||
      westLon === null ||
      eastLon === null
    ) {
      throw new Error(
        "Point outside calibrated area"
      )
    }

    const p00 = this.findPoint(
      northLat,
      westLon
    )

    const p10 = this.findPoint(
      northLat,
      eastLon
    )

    const p01 = this.findPoint(
      southLat,
      westLon
    )

    const p11 = this.findPoint(
      southLat,
      eastLon
    )

    const tx =
      (lon - westLon)
      /
      (eastLon - westLon)

    const ty =
      (northLat - lat)
      /
      (northLat - southLat)

    const x =
      p00.x * (1 - tx) * (1 - ty)
      +
      p10.x * tx * (1 - ty)
      +
      p01.x * (1 - tx) * ty
      +
      p11.x * tx * ty

    const y =
      p00.y * (1 - tx) * (1 - ty)
      +
      p10.y * tx * (1 - ty)
      +
      p01.y * (1 - tx) * ty
      +
      p11.y * tx * ty

    return { x, y }
  }

  private findPoint(
    lat: number,
    lon: number
  ): ControlPoint {
    const point =
      this.calibration.controlPoints.find(
        p =>
          p.lat === lat
          &&
          p.lon === lon
      )

    if (!point) {
      throw new Error(
        `Control point not found: ${lat}, ${lon}`
      )
    }

    return point
  }
}