// interface ChartCalibration {
//   "metadata": {
//       "icaoRegion": "BA",
//       "projection": "WAC",
//       "revision": "2024-08-08"
//     },

//   topLeft: {
//     x: number
//     y: number
//   }

//   bottomRight: {
//     x: number
//     y: number
//   }
  


//   geo?: {
//     topLeft: {
//       lat: number
//       lon: number
//     }

//     bottomRight: {
//       lat: number
//       lon: number
//     }
//   }
// }


interface ChartCalibration {
  topLeft: {
    x: number
    y: number
  }

  bottomRight: {
    x: number
    y: number
  }
  


  geo?: {
    topLeft: {
      lat: number
      lon: number
    }

    bottomRight: {
      lat: number
      lon: number
    }
  }
}