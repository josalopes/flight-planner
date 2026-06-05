export function decimalToDMS(
  value: number,
  type: "lat" | "lon"
) {
  const abs = Math.abs(value)

  const degrees = Math.floor(abs)

  const minutesFloat =
    (abs - degrees) * 60

  const minutes =
    Math.floor(minutesFloat)

  const seconds =
    Math.round(
      (minutesFloat - minutes) * 60
    )

  const hemisphere =
    type === "lat"
      ? value >= 0 ? "N" : "S"
      : value >= 0 ? "E" : "W"

  return `${degrees}°${minutes}'${seconds}"${hemisphere}`
}