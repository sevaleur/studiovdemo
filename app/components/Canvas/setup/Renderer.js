import { WebGLRenderer } from 'three'

export default class Renderer
{
  constructor({ canvas, screen, scene, camera })
  {
    this.canvas = canvas
    this.screen = screen
    this.scene = scene
    this.camera = camera

    this.createInstance()
  }

  createInstance()
  {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })

    this.instance.setSize(this.screen.width, this.screen.height)
    this.instance.setPixelRatio(this.screen.pixelRatio)
  }

  onResize(screen)
  {
    this.instance.setSize(screen.width, screen.height)
    this.instance.setPixelRatio(screen.pixelRatio)
  }

  update()
  {
    this.instance.render(this.scene, this.camera)
  }
}