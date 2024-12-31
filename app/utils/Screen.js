export default class Screen
{
  constructor()
  {
    this.width = window.innerWidth,
    this.height = window.innerHeight,
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.aspectRatio = this.width / this.height
  }

  onResize()
  {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.aspectRatio = this.width / this.height
  }
}