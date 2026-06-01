interface ChartCalibration {
  topLeft: {
    x: number
    y: number
  }

  bottomRight: {
    x: number
    y: number
  }
  
  // crop: {
  //   x: number
  //   y: number
  //   width: number
  //   height: number
  // }

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