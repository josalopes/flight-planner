import calibrations from "@/data/chart-calibrations.json"

export function getChartCalibration(
  pdfName: string
) {
  return calibrations[
    pdfName as keyof typeof calibrations
  ]
}