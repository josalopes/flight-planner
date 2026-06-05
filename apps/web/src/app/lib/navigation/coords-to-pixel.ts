import { ChartBounds } from "@/server/aisweb/types"

// export function latLonToPixel(
//   lat: number,
//   lon: number,

//   bounds: {
//     north: number
//     south: number
//     west: number
//     east: number
//   },

//   width: number,
//   height: number
// ) {
//   const meanLat =
//     (bounds.north + bounds.south) / 2

//   const scale =
//     Math.cos(
//       meanLat * Math.PI / 180
//     )

//   const west =
//     bounds.west * scale

//   const east =
//     bounds.east * scale

//   const longitude =
//     lon * scale

//   const x =
//     (
//       (longitude - west)
//       /
//       (east - west)
//     )
//     * width

//   const y =
//     (
//       (bounds.north - lat)
//       /
//       (bounds.north - bounds.south)
//     )
//     * height

//   return { x, y }
// }

export function latLonToPixel(
  lat: number,
  lon: number,
  bounds: ChartBounds,
  width: number,
  height: number
) {
  console.log("latLonToPixel EXECUTOU")

  console.log({
    lat,
    lon,
    bounds,
    width,
    height
  })

  const x =
    ((lon - bounds.west) /
      (bounds.east - bounds.west))
    * width

  const y =
    ((bounds.north - lat) /
      (bounds.north - bounds.south))
    * height

  console.log({ x, y })

  return { x, y }
}