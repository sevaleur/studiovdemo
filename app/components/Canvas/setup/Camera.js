import { PerspectiveCamera } from "three"

export default class Camera
{
  constructor({ screen, scene })
  {
    this.screen = screen
    this.scene = scene

    this.createInstance()
  }

  createInstance()
  {
    this.instance = new PerspectiveCamera(
      75,
      this.screen.aspectRatio,
      0.1,
      1000
    )
    this.instance.position.set(0, 0, 2)
    this.instance.updateProjectionMatrix()
    this.scene.add(this.instance)
  }

  onResize(screen)
  {
    this.instance.aspect = screen.aspectRatio
    this.instance.updateProjectionMatrix()
  }
}