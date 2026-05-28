interface Props {
  spacing: number
  setSpacing: (v: number) => void
  thickness: number
  setThickness: (v: number) => void
  color: string
  setColor: (v: string) => void
  dpi: number
  setDpi: (v: number) => void
}

export function GridControls({
  spacing,
  setSpacing,
  thickness,
  setThickness,
  color,
  setColor,
  dpi,
  setDpi
}: Props) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 w-80">
      <h3 className="text-lg font-semibold">Configurações</h3>

      <div>
        <label className="text-sm">Espaçamento (cm)</label>
        <input
          type="number"
          value={spacing}
          onChange={(e) => setSpacing(Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label className="text-sm">Espessura</label>
        <input
          type="number"
          value={thickness}
          min={1}
          max={5}
          onChange={(e) => setThickness(Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label className="text-sm">Cor</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full mt-1"
        />
      </div>

      <div>
        <label className="text-sm">DPI</label>
        <select
          value={dpi}
          onChange={(e) => setDpi(Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        >
          <option value={96}>96 (Tela)</option>
          <option value={300}>300 (Impressão)</option>
        </select>
      </div>
    </div>
  )
}