export function calibrationToCrop(
  calibration: ChartCalibration,
  ppu: number
) {
  return {
    x: calibration.topLeft.x * ppu,

    y: calibration.topLeft.y * ppu,

    width:
      (calibration.bottomRight.x -
       calibration.topLeft.x) * ppu,

    height:
      (calibration.bottomRight.y -
       calibration.topLeft.y) * ppu
  }
}