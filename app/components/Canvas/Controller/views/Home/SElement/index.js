import { ShaderMaterial, Mesh } from "three"

import gsap from 'gsap'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

export default class SElement
{
  constructor({ element, index, parent, bounds, disp, screen, viewport, geometry, scene })
  {
    this.element = element
    this.index = index
    this.parent = parent
    this.bounds = bounds
    this.disp = disp
    this.screen = screen
    this.viewport = viewport
    this.geometry = geometry
    this.scene = scene

    this.pos    = { x: 0, y: 0 }
    this.scale  = { x: 0, y: 0 }

    this.selected = false

    this.createMaterial()
    this.createTexture()
    this.createMesh()
    this.createAnimations()
  }

  createMaterial()
  {
    this.material = new ShaderMaterial({
      uniforms: {
        tMap:           { value: null },
        tDisp:          { value: this.disp },
        uAlpha:         { value: 0.0 },
        uState:         { value: 0.0 },
        uTime:          { value: 0.0 }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true
    })
  }

  createTexture()
  {
    let src = this.element.querySelector('img').getAttribute('data-src')
    this.texture = window.IMAGE_TEXTURES[src]
    this.material.uniforms.tMap.value = this.texture
  }

  createMesh()
  {
    this.plane = new Mesh(this.geometry, this.material)
    this.plane.position.z = -0.01
    this.scene.add(this.plane)
  }

  createAnimations()
  {
    this.onStateChange = gsap.fromTo(
      this.material.uniforms.uState,
      {
        value: 0.0
      },
      {
        value: 0.2,
        duration: 1.4,
        ease: 'power2.inOut',
        paused: true,
        onComplete: () => this.selected = true,
        onReverseComplete: () =>
        {
          this.selected = false
          this.material.uniforms.uAlpha.value = 0.0
        }

      }
    )

    this.onAlphaChange = gsap.fromTo(
      this.material.uniforms.uAlpha,
      {
        value: 0.0,
      },
      {
        value: 1.0,
        ease: 'power2.inOut',
        paused: true
      }
    )
  }

  onSelect()
  {
    this.onAlphaChange.play()
      .eventCallback('onComplete', () =>
      {
        this.onStateChange.play()
      }
    )
  }

  onBack()
  {
    this.onStateChange.reverse()
      .eventCallback('onReverseComplete', () =>
      {
        this.onAlphaChange.reverse()
      }
    )
  }

  onHide()
  {
    this.onAlphaChange.reverse()
  }

  onResize(sizes)
  {
    if(sizes)
    {
      const { screen, viewport, bounds } = sizes

      if(bounds) this.bounds = bounds
      if(screen) this.screen = screen
      if(viewport) this.viewport = viewport
    }
  }

  updateScale()
  {
    this.plane.scale.x = this.viewport.width * this.bounds.width / this.screen.width
    this.plane.scale.y = this.viewport.height * this.bounds.height / this.screen.height
  }

  updateX()
  {
    this.x = (this.bounds.left / this.screen.width) * this.viewport.width
    this.plane.position.x = (-this.viewport.width / 2) + (this.plane.scale.x / 2) + this.x
  }

  updateY()
  {
    this.y = (this.bounds.top / this.screen.height) * this.viewport.height
    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - this.y
  }

  update()
  {
    if(!this.bounds) return

    this.active = this.parent.dataset.active === 'true'

    this.updateScale()
    this.updateX()
    this.updateY()
  }
}