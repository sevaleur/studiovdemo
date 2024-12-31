import { PlaneGeometry } from 'three'

import Home from './views/Home'
import Work from './views/Work'
import Info from './views/Info'

export default class Controller
{
  constructor({ scene, screen, viewport })
  {
    this.scene = scene
    this.screen = screen
    this.viewport = viewport

    this.createGeometry()
  }

  createGeometry()
  {
    this.geometry = new PlaneGeometry(1, 1, 10, 10)
  }

  createHome()
  {
    if(this.home) this.destroyHome()

    this.home = new Home({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      geo: this.geometry
    })
  }

  createWork()
  {
    if(this.work) this.destroyWork()

    this.work = new Work({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      geometry: this.geometry
    })
  }

  createInfo()
  {
    if(this.info) this.destroyInfo()

    this.info = new Info({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      geometry: this.geometry
    })
  }

  /*
  *
  ** DESTROY.
  *
  */

  destroyHome()
  {
    if(!this.home) return

    this.home.destroy()
    this.home = null
  }

  destroyWork()
  {
    if(!this.work) return

    this.work.destroy()
    this.work = null
  }

  destroyInfo()
  {
    if(!this.info) return

    this.info.destroy()
    this.info = null
  }

/*
*
** EVENTS.
*
*/

  onChangeStart(template, url, push)
  {
    if(!push)
      return

    if(this.home)
      this.home.hide()

    if(this.work)
      this.work.hide()

    if(this.info)
      this.info.hide()
  }

  onChange(template)
  {
    switch(template)
    {
      case 'home':
        this.createHome()

        this.destroyWork()
        this.destroyInfo()
        break
      case 'work':
        this.createWork()

        this.destroyHome()
        this.destroyInfo()
        break
      case 'info':
        this.createInfo()

        this.destroyHome()
        this.destroyWork()
      default:
      break
    }
  }

  onResize({ screen, viewport })
  {
    if(this.home) this.home.onResize({ screen, viewport })
    if(this.work) this.work.onResize({ screen, viewport })
    if(this.info) this.info.onResize({ screen, viewport })
  }

  onTouchDown({ y, x })
  {
    if(this.work)
      this.work.onTouchDown({ y, x })
  }

  onTouchMove({ y, x })
  {
    if(this.work)
      this.work.onTouchMove({ y, x })
  }

  onTouchUp({ y, x })
  {
    if(this.work)
      this.work.onTouchUp({ y, x })
  }

  onWheel(e)
  {
    if(this.work)
      this.work.onWheel(e)
  }

  /*
  *
  ** UPDATE.
  *
  */

  update(scroll)
  {
    if(this.home)
      this.home.update()

    if(this.work)
      this.work.update()

    if(this.info)
      this.info.update()
  }
}