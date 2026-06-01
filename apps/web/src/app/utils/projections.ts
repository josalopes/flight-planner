// function projectLambert(lat: number, lng: number) {
//   const φ = lat * Math.PI / 180
//   const λ = lng * Math.PI / 180

//   const φ1 = lat1 * Math.PI / 180 // paralelo padrão 1
//   const φ2 = lat2 * Math.PI / 180 // paralelo padrão 2
//   const λ0 = lon0 * Math.PI / 180 // meridiano central

//   const n =
//     Math.log(Math.cos(φ1) / Math.cos(φ2)) /
//     Math.log(
//       Math.tan(Math.PI / 4 + φ2 / 2) /
//       Math.tan(Math.PI / 4 + φ1 / 2)
//     )

//   const F =
//     (Math.cos(φ1) * Math.pow(Math.tan(Math.PI / 4 + φ1 / 2), n)) / n

//   const ρ = F / Math.pow(Math.tan(Math.PI / 4 + φ / 2), n)
//   const ρ0 = F / Math.pow(Math.tan(Math.PI / 4 + φ1 / 2), n)

//   const x = ρ * Math.sin(n * (λ - λ0))
//   const y = ρ0 - ρ * Math.cos(n * (λ - λ0))

//   return { x, y }
// }