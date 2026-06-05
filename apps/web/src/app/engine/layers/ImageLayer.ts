import { CanvasLayer } from "../types/CanvasLayer"
interface CropRect {
  x: number
  y: number
  width: number
  height: number
}
export class ImageLayer implements CanvasLayer {
  id = "image"
  visible = true
  isUI = false
  
  private image: HTMLImageElement | null = null
  private crop: CropRect | null = null

  setImage(img: HTMLImageElement | null) {
    this.image = img    
  }

  setCrop(crop: CropRect | null) {
    this.crop = crop
  }

  getCrop() {
    return this.crop
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.image) return

    // sem crop
    if (!this.crop) {
      ctx.drawImage(this.image, 0, 0)

      // esse era o retângulo fixo usado durante o processo de crop
      ctx.strokeStyle = "red"
      ctx.lineWidth = 2

      // ctx.strokeRect(
      //   858,
      //   138,
      //   3793,
      //   2600
      // )

      return
    }

    // com crop
    ctx.drawImage(
      this.image,

      // origem na imagem
      this.crop.x,
      this.crop.y,

      // tamanho do recorte
      this.crop.width,
      this.crop.height,

      // destino no canvas
      0,
      0,

      // tamanho desenhado
      this.crop.width,
      this.crop.height
    )  
  }
}