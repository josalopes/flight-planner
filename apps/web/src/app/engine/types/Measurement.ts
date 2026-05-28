export interface Measurement {
  id: string
  start: { x: number; y: number }
  end: { x: number; y: number }
  selected?: boolean
}