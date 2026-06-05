// app/api/charts/[id]/route.ts

import { promises as fs } from "fs"
import path from "path"

export async function GET(
  request: Request,
  { params }: {
    params: Promise<{ id: string }>
  }
) {
  const { id } = await params

  const filePath = path.join(
    process.cwd(),
    "storage",
    "charts",
    `${id}.png`
  )

  const buffer =
    await fs.readFile(filePath)

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png"
    }
  })
}