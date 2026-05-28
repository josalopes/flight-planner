import { Point } from "./Point";

export interface TransformableObject {
  hitHandle(
    point: Point,
    tolerance: number
  ): string | null
}