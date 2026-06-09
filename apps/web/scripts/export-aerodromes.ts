// scripts/export-aerodromes.ts

import fs from "node:fs/promises"

import {
  getAllAerodromes
} from "@/server/aisweb/get-all-aerodromes"

async function main() {

  const aerodromes =
    await getAllAerodromes()

  await fs.writeFile(
    "./src/data/aerodromes.json",
    JSON.stringify(
      aerodromes,
      null,
      2
    ),
    "utf-8"
  )

  console.log(
    `${aerodromes.length} aeródromos exportados`
  )
}

main()