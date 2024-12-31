import { ShaderMaterial, Mesh } from "three"
import gsap from 'gsap'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

export default class Element
{
  constructor({ element, index, parent, geometry, selectedBounds, scene, screen, viewport })
  {
    this.element        = element
    this.index          = index
    this.parent         = parent
    this.geometry       = geometry
    this.selectedBounds = selectedBounds
    this.scene          = scene
    this.screen         = screen
    this.viewport       = viewport

    this.initialPos     = { x: 0, y: 0 }
    this.selectedPos    = { x: 0, y: 0 }
    this.downPos        = { x: 0, y: 0 }
    this.upPos          = { x: 0, y: 0 }

    this.scale          = { x: 0, y: 0 }
    this.selectedScale  = { x: 0, y: 0 }

    this.selected       = false
    this.up             = false
    this.down           = false
    this.animating      = false

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
        tMap:   { value: null },
        uAlpha: { value: 0.0 },
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
    this.scene.add(this.plane)
  }

  createAnimations()
  {
    this.onAlphaChange = gsap.fromTo(
      this.material.uniforms.uAlpha,
      {
        value: 0.0
      },
      {
        value: 1.0,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.onScaleChange = gsap.fromTo(
      this.plane.scale,
      {
        x: 0,
        y: 0,
        z: 0
      },
      {
        x: this.scale.x,
        y: this.scale.y,
        z: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true,
        onComplete: () =>
        {
          this.onSelectedScale = gsap.fromTo(
            this.plane.scale,
            {
              x: this.scale.x,
              y: this.scale.y,
            },
            {
              x: this.selectedScale.x,
              y: this.selectedScale.y,
              duration: 0.8,
              ease: 'power2.inOut',
              paused: true
            }
          )
        }
      }
    )
  }

  createBounds()
  {
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()
  }

  show()
  {
    gsap.delayedCall(0.5, () =>
    {
      this.onAlphaChange.play()
      this.onScaleChange.play()
    })
  }

  hide()
  {
    if(!this.selected)
    {
      this.onScaleChange.reverse()
      this.onAlphaChange.reverse()
    }
    else
    {
      this.onAlphaChange.reverse()
    }
  }

  onSelect()
  {
    this.onSelectedPosition = gsap.fromTo(
      this.plane.position,
      {
        x: this.initialPos.x,
        y: this.initialPos.y
      },
      {
        x: this.selectedPos.x,
        y: this.selectedPos.y,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.onSelectedPosition.play()
    this.onSelectedScale.play()
  }

  onNotSelectedUp()
  {
    this.up = true

    this.onNotSelectedYUp = gsap.fromTo(
      this.plane.position,
      {
        y: this.initialPos.y
      },
      {
        y: this.upPos.y,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.onNotSelectedYUp.play()
  }

  onNotSelectedDown()
  {
    this.down = true

    this.onNotSelectedYDown = gsap.fromTo(
      this.plane.position,
      {
        y: this.initialPos.y
      },
      {
        y: this.downPos.y,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.onNotSelectedYDown.play()
  }

  onBack()
  {
    this.animating = true

    if(this.selected)
    {
      gsap.delayedCall(
        0.4, () =>
        {
          this.onSelectedScale.reverse()
          this.onSelectedPosition.reverse()
            .eventCallback(
              'onReverseComplete', () =>
              {
                this.selected = false
                this.animating = false
                this.onSelectedPosition = null
              }
            )
        }
      )
    }
    else
    {
      if(this.up)
      {
        gsap.delayedCall(
          0.4, () =>
          {
            this.onNotSelectedYUp.reverse()
              .eventCallback(
                'onReverseComplete', () =>
                {
                  this.up = false
                  this.animating = false
                  this.onNotSelectedYUp = null
                }
              )
          }
        )
      }

      if(this.down)
      {
        gsap.delayedCall(
          0.4, () =>
          {
            this.onNotSelectedYDown.reverse()
              .eventCallback(
                'onReverseComplete', () =>
                {
                  this.down = false
                  this.animating = false
                  this.onNotSelectedYDown = null
                }
              )
          }
        )
      }
    }
  }

  onResize(sizes)
  {
    const { screen, viewport, bounds } = sizes

    if(screen)    this.screen = screen
    if(viewport)  this.viewport = viewport
    if(bounds)    this.selectedBounds = bounds

    this.createBounds()
  }

  updateScale()
  {
    this.scale.x = this.viewport.width * this.bounds.width / this.screen.width
    this.scale.y = this.viewport.height * this.bounds.height / this.screen.height

    this.selectedScale.x = this.viewport.width * this.selectedBounds.width / this.screen.width
    this.selectedScale.y = this.viewport.height * this.selectedBounds.height / this.screen.height
  }

  updateX()
  {
    this.x = (this.bounds.left / this.screen.width) * this.viewport.width
    this.initialPos.x = (-this.viewport.width / 2) + (this.scale.x / 2) + this.x

    this.sX = (this.selectedBounds.left / this.screen.width) * this.viewport.width
    this.selectedPos.x = (-this.viewport.width / 2) + (this.selectedScale.x / 2) + this.sX

    if(!this.selected) this.plane.position.x = this.initialPos.x
  }

  updateY(current = 0)
  {
    this.y = ((this.bounds.top + current) / this.screen.height) * this.viewport.height
    this.initialPos.y = (this.viewport.height / 2) - (this.scale.y / 2) - this.y

    this.sY = (this.selectedBounds.top / this.screen.height) * this.viewport.height
    this.selectedPos.y = (this.viewport.height / 2) - (this.selectedScale.y / 2) - this.sY

    this.downPos.y = this.initialPos.y - 2.5
    this.upPos.y = this.initialPos.y + 2.5

    if(!this.selected && !this.up) this.plane.position.y = this.initialPos.y
    if(!this.selected && !this.down) this.plane.position.y = this.initialPos.y
  }

  update(scroll)
  {
    if(!this.bounds) return

    this.selected = this.parent.dataset.selected === 'true'

    this.updateScale()
    this.updateX()
    this.updateY(scroll.current)
  }
}