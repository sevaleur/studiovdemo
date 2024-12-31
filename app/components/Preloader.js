import { TextureLoader } from 'three'
import gsap from 'gsap'

import Component from "classes/Component"

export default class Preloader extends Component
{
  constructor()
  {
    super({
      element: '.preloader',
      elements: {
        preloadBorder: '.preloader__border',
        preloadNum: '.preloader__number__text',
      }
    })

    this.loaded = 0

    window.IMAGE_TEXTURES = {}

    this.createLoader()
  }

  /*
    CREATE.
  */

  createLoader()
  {
    const textureLoader = new TextureLoader()

    window.ASSETS.forEach(
      image =>
      {
        const texture = textureLoader.load(
          image,
          (data) =>
          {
            window.IMAGE_TEXTURES[image] = data
            this.onAssetLoaded()
          }
        )
      }
    )
  }

  /*
    EVENTS.
  */

  onAssetLoaded()
  {
    this.loaded += 1

    this.percent = this.loaded / window.ASSETS.length

    this.elements.preloadNum.innerHTML = `${Math.round(this.percent * 100)}%`

    this.animate()

    if(this.percent === 1)
      this.onLoaded()
  }

  onLoaded()
  {
    return new Promise(resolve =>
    {
      gsap.to(
        this.elements.preloadNum,
        {
          yPercent: 100,
          duration: 0.8,
          ease: 'power2.inOut',
          delay: 0.5,
          onComplete: () =>
          {
            this.emit('completed')
          }
        }
      )
    })
  }

  /*
    ANIMATIONS.
  */

  animate()
  {
    gsap.to(
      this.elements.preloadBorder,
      {
        scaleX: this.percent
      }
    )
  }

  /*
    DESTROY.
  */

  destroy()
  {
    this.element.parentNode.removeChild(this.element)
  }
}
