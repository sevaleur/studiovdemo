import { Group, TextureLoader } from 'three'

import Element from './Element'
import SElement from './SElement'

export default class Home
{
  constructor({ scene, screen, viewport, geo })
  {
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geo = geo

    this.group = new Group()

    this.getElements()
    this.createBounds()
    this.createElements()

    this.onResize({ screen, viewport })

    this.scene.add(this.group)

    this.show()
  }

  getElements()
  {
    this.imgs = document.querySelectorAll('figure.home__showcase__element__media__figure')
    this.smImgs = document.querySelectorAll('figure.home__selected__smImage__figure')

    this.parents = document.querySelectorAll('.home__showcase__element')
    this.disp = new TextureLoader().load(this.imgs[0].querySelector('img').dataset.displacement)

    this.selectImage = document.querySelector('.home__selected__image')

    this.backBtn = document.querySelector('.home__selected__back')
  }

  createBounds()
  {
    this.smBounds = this.smImgs[0].getBoundingClientRect()
    this.selectBounds = this.selectImage.getBoundingClientRect()
  }

  createElements()
  {
    this.elements = Array.from(
      this.imgs,
      (img, idx) =>
      {
        return new Element({
          element: img,
          index: idx,
          parent: this.parents[idx],
          sibling: this.smImgs[idx],
          disp: this.disp,
          lBounds: this.selectBounds,
          screen: this.screen,
          viewport: this.viewport,
          geometry: this.geo,
          scene: this.group
        })
      }
    )

    this.sElems = Array.from(
      this.smImgs,
      (img, idx) =>
      {
        return new SElement({
          element: img,
          index: idx,
          parent: this.parents[idx],
          disp: this.disp,
          bounds: this.smBounds,
          screen: this.screen,
          viewport: this.viewport,
          geometry: this.geo,
          scene: this.group
        })
      }
    )
  }

  show()
  {
    this.elements.forEach( element => element.show() )
  }

  hide()
  {
    this.elements.forEach(
      ( element, index ) =>
      {
        element.hide()
        this.sElems[index].onBack()
      }
    )
  }

  onMouseOver(idx)
  {
    this.elements.forEach(
      (element, index) =>
      {
        if(element.initialAnimFinished)
        {
          if(idx === index)
            element.onMouseOver()
        }
      }
    )
  }

  onMouseLeave(idx)
  {
    this.elements.forEach(
      (element, index) =>
      {
        if(idx === index)
          element.onMouseLeave()
      }
    )
  }

  onSelect(idx)
  {
    this.backBtn.dataset.index = idx

    let length = this.elements.length - 1

    if(idx > 0)
    {
      for(let i = idx - 1; i >= 0; i--)
      {
        this.elements[i].onNoSelect(idx, length)
      }
    }

    if(idx < length)
    {
      for(let j = idx + 1; j < this.elements.length; j++)
      {
        this.elements[j].onNoSelect(idx, length)
      }
    }

    this.sElems[idx].onSelect()
    this.elements[idx].onSelect()
  }

  onBack(idx)
  {
    let length = this.elements.length - 1

    this.elements.forEach(
      (element, index) =>
      {
        if(this.sElems[index].selected) this.sElems[index].onBack()
        element.onBack(idx, length)
      }
    )
  }

  hide()
  {
    let half = Math.floor(this.elements.length / 2)
    let length = this.elements.length - 1

    for(let i = 0; i < half; i++)
    {
      this.elements[i].onNoSelect(half, length)
    }

    for(let j = this.elements.length-1; j >= half; j--)
    {
      this.elements[j].onNoSelect(half - 1, length)
    }
  }

  onResize({screen, viewport})
  {
    this.createBounds()

    this.elements.forEach(
      (element, index) =>
      {
        element.onResize({ screen, viewport, bounds: this.selectBounds })
        this.sElems[index].onResize({ screen, viewport, bounds: this.smBounds })
      }
    )
  }

  update()
  {
    let onBack = this.backBtn.dataset.active === 'true'

    if(onBack) this.onBack(this.backBtn.dataset.index)

    this.elements.forEach(
      (element, idx) =>
      {
        let active  = element.active === true
        let hovered = element.mouseEnter === true
        let left    = element.mouseLeft === true

        if(hovered) this.onMouseOver(idx)
        if(left)    this.onMouseLeave(idx)
        if(active)  this.onSelect(idx)

        element.update()
        this.sElems[idx].update()
      }
    )
  }

  destroy()
  {
    this.scene.remove(this.group)
  }
}