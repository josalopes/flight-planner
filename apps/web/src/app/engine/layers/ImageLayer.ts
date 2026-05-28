import { CanvasLayer } from "../types/CanvasLayer"

export class ImageLayer implements CanvasLayer {
  id = "image"
  visible = true
  isUI = false
  
  private image: HTMLImageElement | null = null

  setImage(img: HTMLImageElement | null) {
    this.image = img
    
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.image) return
    ctx.drawImage(this.image, 0, 0)
  }
}