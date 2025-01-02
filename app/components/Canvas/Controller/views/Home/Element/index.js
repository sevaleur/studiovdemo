import { Mesh, ShaderMaterial } from "three"
import gsap from 'gsap'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

export default class Element
{
  constructor({ element, index, parent, sibling, disp, lBounds, screen, viewport, geometry, scene })
  {
    this.element      = element
    this.index        = index
    this.parent       = parent
    this.sibling      = sibling
    this.disp         = disp
    this.largeBounds  = lBounds
    this.screen       = screen
    this.viewport     = viewport
    this.geometry     = geometry
    this.scene        = scene

    this.initialPos     = { x: 0, y: 0, z: 0 }
    this.selectedPos    = { x: 0, y: 0, z: 0 }
    this.offscreenPos   = { x: 0, y: 0, z: 0 }

    this.initialScale   = { x: 0, y: 0, z: 0 }
    this.selectedScale  = { x: 0, y: 0, z: 0 }

    this.initialAnimFinished  = false
    this.selected             = false

    this.time = 0

    this.active     = this.parent.dataset.active === 'true'
    this.mouseEnter = this.parent.dataset.hovered === 'true'
    this.mouseLeft  = this.parent.dataset.leave === 'true'

    this.createMaterial()
    this.createTexture()
    this.createMesh()
    this.createBounds()
    this.createAnimations()
  }

  createMaterial()
  {
    this.material = new ShaderMaterial({
      uniforms: {
        tMap:           { value: null },
        tState:         { value: null },
        tDisp:          { value: this.disp },
        uAlpha:         { value: 0.0 },
        uState:         { value: 0.0 },
        uTime:          { value: 0.0 },
        uPlaneSize:     { value: { x: 0, y: 0 } },
        uImageSize:     { value: { x: 0, y: 0 } },
        uViewportSize:  { value: { x: this.viewport.width, y: this.viewport.height } },
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

    this.material.uniforms.uImageSize.value.x = this.texture.source.data.naturalWidth
    this.material.uniforms.uImageSize.value.y = this.texture.source.data.naturalHeight

    let stateSrc = this.sibling.querySelector('img').getAttribute('data-src')
    this.stateTexture = window.IMAGE_TEXTURES[stateSrc]
    this.material.uniforms.tState.value = this.stateTexture
  }

  createMesh()
  {
    this.plane = new Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
  }

  createBounds()
  {
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()

    this.material.uniforms.uPlaneSize.value.x = this.plane.scale.x
    this.material.uniforms.uPlaneSize.value.y = this.plane.scale.y
  }

  createAnimations()
  {
    this.parent.style.cursor = 'default'

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

    this.onStateChange = gsap.fromTo(
      this.material.uniforms.uState,
      {
        value: 0.0
      },
      {
        value: 0.2,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true
      }
    )

    gsap.set(
      this.plane.position,
      {
        x: 0.05 * -this.index,
        y: 0.05 * this.index,
        z: 0.1 * -this.index
      }
    )

    this.onInitialAnim = gsap.fromTo(
      this.plane.scale,
      {
        x: 0,
        y: 0,
        z: 0
      },
      {
        x: this.initialScale.x,
        y: this.initialScale.y,
        z: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true,
        onComplete: () => {
          this.offscreenPos.x = this.initialPos.x
          this.offscreenPos.y = this.initialPos.y - 1.5

          gsap.to(
            this.plane.position,
            {
              x: this.initialPos.x,
              y: this.initialPos.y,
              z: 0,
              duration: 0.8,
              delay: 0.1 * this.index,
              ease: 'power2.inOut',
              onComplete: () => {
                this.initialAnimFinished = true
                this.parent.style.cursor = 'pointer'

                this.onSelectPosition = gsap.fromTo(
                  this.plane.position,
                  {
                    x: this.initialPos.x,
                    y: this.initialPos.y,
                    z: 0
                  },
                  {
                    x: this.selectedPos.x,
                    y: this.selectedPos.y,
                    z: 0.01,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    paused: true
                  }
                )

                this.onSelectScale = gsap.fromTo(
                  this.plane.scale,
                  {
                    x: this.initialScale.x,
                    y: this.initialScale.y,
                  },
                  {
                    x: this.selectedScale.x,
                    y: this.selectedScale.y,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    paused: true
                  }
                )

                this.onNotSelectedXY = gsap.fromTo(
                  this.plane.position,
                  {
                    x: this.initialPos.x,
                    y: this.initialPos.y,
                  },
                  {
                    x: this.offscreenPos.x,
                    y: this.offscreenPos.y,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    paused: true
                  }
                )
              }
            }
          )
        }
      }
    )
  }

  show()
  {
    if(!this.initialAnimFinished)
    {
      this.onAlphaChange.play()
        .eventCallback(
          'onComplete', () =>
          {
            this.onInitialAnim.play()
          }
        )
    }
    else
    {
      this.onAlphaChange.play()
    }
  }

  hide()
  {
    this.onAlphaChange.reverse()
  }

  onMouseOver()
  {
    this.onStateChange.play()
  }

  onMouseLeave()
  {
    this.onStateChange.reverse()
  }

  onSelect()
  {
    this.onSelectPosition.play()
      .eventCallback(
        'onComplete', () =>
        {
          this.onSelectScale.play()
            .eventCallback(
              'onComplete', () =>
              {
                this.selected = true
              }
            )
        }
      )
  }

  onNoSelect(idx, length)
  {
    if(idx > this.index)
    {
      gsap.delayedCall(0.1 * this.index, () => this.onNotSelectedXY.play())
    }

    if(idx < this.index)
    {
      let nIdx = length - this.index
      gsap.delayedCall(0.1 * nIdx, () => this.onNotSelectedXY.play())
    }
  }

  onBack(idx, length)
  {
    this.parent.style.display = 'none'

    if(this.selected)
    {
      this.onSelectScale.reverse()
        .eventCallback(
          'onReverseComplete', () =>
          {
            this.onSelectPosition.reverse()
            .eventCallback(
              'onReverseComplete', () =>
              {
                this.selected = false
                this.parent.style.display = 'block'
              }
            )
          }
        )
    }
    else
    {
      if(idx > this.index)
      {
        let nIdx = length - this.index
        gsap.delayedCall(
          0.1 * nIdx, () =>
          {
            this.onNotSelectedXY.reverse()
              .eventCallback(
                'onReverseComplete', () => this.parent.style.display = 'block'
              )
          }
        )
      }

      if(idx < this.index)
      {
        gsap.delayedCall(
          0.1 * this.index, () =>
          {
            this.onNotSelectedXY.reverse()
              .eventCallback(
                'onReverseComplete', () => this.parent.style.display = 'block'
              )
          }
        )
      }
    }
  }

  onResize(sizes)
  {
    if(sizes)
    {
      const { screen, viewport, bounds } = sizes

      this.largeBounds = bounds

      if(screen) this.screen = screen
      if(viewport)
      {
        this.viewport = viewport

        this.plane.material.uniforms.uViewportSize.value.x = this.viewport.width
        this.plane.material.uniforms.uViewportSize.value.y = this.viewport.height
      }
    }

    if(this.selected)
    {
      this.plane.scale.set(this.selectedScale.x, this.selectedScale.y, 0)
      this.plane.position.set(this.selectedPos.x, this.selectedPos.y, 0)
    }
    else if(this.initialAnimFinished)
    {
      this.plane.scale.set(this.initialScale.x, this.initialScale.y, 0)
      this.plane.position.set(this.initialPos.x, this.initialPos.y, 0)
    }

    this.createBounds()
  }

  updateScale()
  {
    this.initialScale.x = this.viewport.width * this.bounds.width / this.screen.width
    this.initialScale.y = this.viewport.height * this.bounds.height / this.screen.height

    this.selectedScale.x = this.viewport.width * this.largeBounds.width / this.screen.width
    this.selectedScale.y = this.viewport.height * this.largeBounds.height / this.screen.height

    this.plane.material.uniforms.uPlaneSize.value.x = this.plane.scale.x
    this.plane.material.uniforms.uPlaneSize.value.y = this.plane.scale.y
  }

  updateX()
  {
    this.x = (this.bounds.left / this.screen.width) * this.viewport.width
    this.initialPos.x = (-this.viewport.width / 2) + (this.plane.scale.x / 2) + this.x

    this.sX = (this.largeBounds.left / this.screen.width) * this.viewport.width
    this.selectedPos.x = (-this.viewport.width / 2) + (this.selectedScale.x / 2) + this.sX
  }

  updateY()
  {
    this.y = (this.bounds.top / this.screen.height) * this.viewport.height
    this.initialPos.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - this.y

    this.sY = (this.largeBounds.top / this.screen.height) * this.viewport.height
    this.selectedPos.y = (this.viewport.height / 2) - (this.selectedScale.y / 2) - this.sY
  }

  update()
  {
    if(!this.bounds) return

    this.active     = this.parent.dataset.active === 'true'
    this.mouseEnter = this.parent.dataset.hovered === 'true'
    this.mouseLeft  = this.parent.dataset.leave === 'true'

    this.updateScale()
    this.updateX()
    this.updateY()
  }
}