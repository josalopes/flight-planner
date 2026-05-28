interface Props {
  width: number
  height: number
  spacing: number
  dpi: number
  scale: number
}

export function Ruler({ width, height, dpi, scale }: Props) {

  const cmToPx = (cm: number) => (cm / 2.54) * dpi * scale

  const totalCmX = (width / (dpi * scale)) * 2.54
  const totalCmY = (height / (dpi * scale)) * 2.54

  return (
    <div className="relative">

      {/* Horizontal */}
      <div className="relative h-8 bg-gray-200 border-b">
        {Array.from({ length: Math.ceil(totalCmX) }).map((_, i) => (
          <div
            key={i}
            className="absolute border-l border-gray-600 h-full text-xs"
            style={{ left: cmToPx(i) }}
          >
            <span className="absolute top-2 left-1">{i}</span>
          </div>
        ))}
      </div>

      {/* Vertical */}
      <div className="absolute top-8 left-0 w-8 bg-gray-200 border-r">
        {Array.from({ length: Math.ceil(totalCmY) }).map((_, i) => (
          <div
            key={i}
            className="absolute border-t border-gray-600 w-full text-xs"
            style={{ top: cmToPx(i) }}
          >
            <span className="absolute left-1 top-0">{i}</span>
          </div>
        ))}
      </div>

    </div>
  )
}