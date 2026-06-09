import fs from "node:fs/promises"
import { XMLParser } from "fast-xml-parser"

const apiKey = "1639440789"
const apiPass = "cdcd55ea-2e97-11f1-a4e0-0050569ac2e1"

const parser = new XMLParser()

async function fetchPage(
  rowstart,
  rowend = 100
) {

  const params =
    new URLSearchParams({
      apiKey,
      apiPass,
      area: "rotaer",
      rowstart: String(rowstart),
      rowend: String(rowend)
    })

  const response =
    await fetch(
      `http://aisweb.decea.mil.br/api/?${params}`
    )

  const xml = await response.text()

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  })

  const result = parser.parse(xml)

  return result.aisweb.rotaer
}

async function main() {

  const firstPage =
    await fetchPage(0)

    console.log(
  JSON.stringify(
    firstPage,
    null,
    2
  )
)

  const total =
    Number(
      firstPage["@_total"]
    )

  console.log(
    `Total informado pela API: ${total}`
  )

  const allItems = [
    ...firstPage.item
  ]

  for (
    let rowstart = 100;
    rowstart < total;
    rowstart += 100
  ) {

    console.log(
      `Baixando ${rowstart}/${total}`
    )

    const page =
      await fetchPage(
        rowstart
      )

    allItems.push(
      ...page.item
    )
  }

  const aerodromes =
    allItems
      .filter(
        item =>
          item.type === "AD"
      )
      .map(
        item => ({
          icao: item.AeroCode,
          name: item.name,
          city: item.city,
          uf: item.uf,
          lat: Number(item.lat),
          lon: Number(item.lng)
        })
      )

  await fs.writeFile(
    "./src/data/aerodromes.json",
    JSON.stringify(
      aerodromes,
      null,
      2
    )
  )

  console.log(
    `${aerodromes.length} aeródromos exportados`
  )
}

main()
