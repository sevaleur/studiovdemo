import { Group, TextureLoader } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import Element from './Element'
import SElement from './SElement'

export default class Work
{
  constructor({ scene, screen, viewport, geometry })
  {
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geometry = geometry

    this.group = new Group()

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      speed: 0.1,
      ease: 0.05
    }

    this.selected = false

    this.tPrefix = Prefix('transform')

    this.getElements()
    this.createBounds()
    this.createElements()

    this.onResize({ screen, viewport })

    this.scene.add(this.group)

    this.show()
  }

  getElements()
  {
    this.workMenu = document.querySelector('.work__menu')
    this.workWrapper = document.querySelector('.work__menu__wrapper')

    this.menuElements = document.querySelectorAll('.work__menu__element')

    this.images = document.querySelectorAll('figure.work__menu__element__media__figure')
    this.smImages = document.querySelectorAll('figure.work__selected__element__rh__media__figure')
    this.disp = new TextureLoader().load(this.smImages[0].querySelector('img').dataset.displacement)

    this.selectedImage = document.querySelectorAll('.work__selected__element__lh__media')

    this.backBtn = document.querySelector('.work__selected__back')
  }

  createElements()
  {
    this.elements = Array.from(
      this.images,
      (element, index) =>
      {
        return new Element({
          element,
          index,
          parent: this.menuElements[index],
          geometry: this.geometry,
          selectedBounds: this.selectedBounds,
          scene: this.scene,
          screen: this.screen,
          viewport: this.viewport
        })
      }
    )

    this.sElements = Array.from(
      this.smImages,
      (element, index) =>
      {
        return new SElement({
          element,
          index,
          parent: this.menuElements[index],
          disp: this.disp,
          screen: this.screen,
          viewport: this.viewport,
          geometry: this.geometry,
          scene: this.scene
        })
      }
    )
  }

  createBounds()
  {
    this.selectedBounds = this.selectedImage[0].getBoundingClientRect()
    this.fullBounds = this.workWrapper.getBoundingClientRect()

    if(this.elements)
      this.scroll.limit = this.fullBounds.height - this.elements[0].bounds.height
  }

  show()
  {
    this.elements.forEach(
      (element, index) =>
      {
        element.show()
      }
    )
  }

  hide()
  {
    this.elements.forEach(
      (element, index) =>
      {
        element.hide()
        if(this.sElements[index].selected) this.sElements[index].onBack()
      }
    )
  }

  onSelect(idx)
  {
    this.selected = true

    this.elements.forEach(
      (el, index) =>
      {
        if(index === idx)
        {
          el.onSelect()
          this.sElements[index].onSelect()
        }

        if(idx > index) el.onNotSelectedUp()
        if(idx < index) el.onNotSelectedDown()
      }
    )
  }

  onBack()
  {
    this.selected = false
    this.elements.forEach(
      (el, index) =>
      {
        el.onBack()
        this.sElements[index].onBack()
      }
    )

  }

  onResize({ screen, viewport })
  {
    this.createBounds()

    this.elements.forEach(
      element =>
      {
        element.onResize(
          {
            screen,
            viewport,
            bounds: this.selectedBounds,
          }
        )
      }
    )
  }

  onTouchDown({y, x})
  {
    if(this.selected) return

    this.scroll.position = this.scroll.current
  }

  onTouchMove({y, x})
  {
    if(this.selected) return

    const dist = y.start - y.end

    this.scroll.target = this.scroll.position - dist * 1.5
  }

  onTouchUp({ y, x })
  {

  }

  onWheel({ pixelY })
  {
    if(this.selected) return

    this.scroll.target -= pixelY * 0.5
  }

  update()
  {
    this.onBackActive = this.backBtn.dataset.active === 'true'

    if(this.onBackActive) this.onBack()

    this.elements.forEach(
      (element, idx) =>
      {
        if(this.selected || this.onBackActive || element.animating) return

        if(element.selected) this.onSelect(idx)
      }
    )

    if(this.selected) return
    if(this.elements[0].animating) return

    this.scroll.target = gsap.utils.clamp(-this.scroll.limit, 0, this.scroll.target)
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.ease)

    this.workMenu.style[this.tPrefix] = `translateY(${this.scroll.current}px)`

    if(this.scroll.current > -0.01) this.scroll.current = 0

    this.elements.forEach(element => element.update(this.scroll))
    this.sElements.forEach(element => element.update())

    this.scroll.last = this.scroll.current
  }

  destroy()
  {
    this.scene.remove(this.group)
  }
}