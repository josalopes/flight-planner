import { ChartMetadata } from "@/server/aisweb/types";

export const SALVADOR_WAC: ChartMetadata = {
  id: "3141",
  name: "SALVADOR",

  imageUrl: "/charts/3141.png",

  width: 7893,
  height: 5266,

  west: -43.00620182286407,
  east: -36.99227044206405,

  north: -11.996883601411854,
  south: -16.00921891767852,

  crs: "EPSG:4326",

  pixelSizeX: 1000,
  pixelSizeY: 1000,

  nativeResolution: "high" 
}

export const BRASILIA_WAC: ChartMetadata = {
  id: "3140",
  name: "BRASILIA",

  imageUrl: "/charts/3140.png",

  width: 7876,
  height: 5251,

  west: -49.0017681,
  east: -43.0007896,

  north: -12.0007195,
  south: -16.0016258,

  crs: "EPSG:4326",
  pixelSizeX: 1000,
  pixelSizeY: 1000,

  nativeResolution: "high"   
}

export const RECIFE_WAC: ChartMetadata = {
  id: "3066",
  name: "RECIFE",

  imageUrl: "/charts/3066.png",

  width: 15496,
  height: 10331,

  west: -39.0002691,
  east: -32.9999444,

  north: -7.9997544,
  south: -12.0000999,

  crs: "EPSG:4326",
  pixelSizeX: 1000,
  pixelSizeY: 1000,

  nativeResolution: "high" 
}

export const PETROLINA_WAC: ChartMetadata = {
  id: "3067",
  name: "PETROLINA",

  imageUrl: "/charts/3067.png",

  width: 7875,
  height: 5250,

  west: -45.0012891,
  east: -39.0010725,

  north: -8.0005725,
  south: -12.0007169,

  crs: "EPSG:4326",
  pixelSizeX: 1000,
  pixelSizeY: 1000,

  nativeResolution: "high" 
}

export const CHART_CATALOGUE: ChartMetadata[] = [
  SALVADOR_WAC,
  BRASILIA_WAC,
  RECIFE_WAC,
  PETROLINA_WAC
]