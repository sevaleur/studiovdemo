import normalizeWheel from 'normalize-wheel'
import each from 'lodash/each'

import Screen from './utils/Screen'

import Canvas from 'components/Canvas'
import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'

import Home from './views/home'
import Work from './views/work'
import Info from './views/info'

export default class App
{
  constructor()
  {
    this.createScreen()
    this.createContent()
    this.createCanvas()
    this.createPreloader()
    this.createNavigation()
    this.createPages()

    this.addEventListeners()
    this.addLinkListeners()

    this.onResize()

    this.update()
  }

  createScreen()
  {
    this.screen = new Screen()
  }

  createContent()
  {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createCanvas()
  {
    this._canvas = document.createElement('canvas')
    document.body.appendChild(this._canvas)

    this.canvas = new Canvas({
      template: this.template,
      canvas: this._canvas,
      screen: this.screen
    })
  }

  createPreloader()
  {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createNavigation()
  {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPages()
  {
    this.pages = {
      home: new Home(),
      work: new Work(),
      info: new Info()
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  onPreloaded()
  {
    this.onResize()

    this.canvas.onPreloaded()

    this.preloader.destroy()

    this.navigation.show()
    this.page.show()

    this.preloader = null
  }


  async onChange({ url, push = true })
  {
    this.canvas.onChangeStart(this.template, url, push)

    await this.page.hide()
    const req = await window.fetch(url)

    if(req.status === 200)
    {
      const html = await req.text()
      const div = document.createElement('div')

      if(push)
        window.history.pushState({}, '', url)

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.canvas.onChange(this.template)
      this.navigation.onChange(this.template)

      this.page = this.pages[this.template]
      this.page.create()

      this.onResize()
      this.page.show()

      this.addLinkListeners()
    }
    else
    {
      console.log('error')
    }
  }

  onResize()
  {
    this.screen.onResize()

    if(this.page && this.page.onResize)
      this.page.onResize()

    if(this.canvas && this.canvas.onResize)
      this.canvas.onResize( this.screen )
  }

  onTouchDown(e)
  {
    if(this.preloader) return

    if(this.canvas && this.canvas.onTouchDown)
      this.canvas.onTouchDown(e)

    if(this.page && this.page.onTouchDown)
      this.page.onTouchDown(e)
  }

  onTouchMove(e)
  {
    if(this.preloader) return

    if(this.canvas && this.canvas.onTouchMove)
      this.canvas.onTouchMove(e)

    if(this.page && this.page.onTouchMove)
      this.page.onTouchMove(e)
  }

  onTouchUp(e)
  {
    if(this.preloader) return

    if(this.canvas && this.canvas.onTouchUp)
      this.canvas.onTouchUp(e)

    if(this.page && this.page.onTouchUp)
      this.page.onTouchUp(e)
  }

  onMove(e)
  {
    if(this.preloader) return

    if(this.canvas && this.canvas.onMove)
      this.canvas.onMove(e)

    if(this.page && this.page.onMove)
      this.page.onMove(e)
  }

  onWheel(e)
  {
    if(this.preloader) return

    const norm_wheel = normalizeWheel(e)

    if(this.canvas && this.canvas.onWheel)
      this.canvas.onWheel(norm_wheel)

    if(this.page && this.page.onWheel)
      this.page.onWheel(norm_wheel)
  }

  onPopState()
  {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  /*
  *
  ** LOOP.
  *
  */

  update()
  {
    if(this.page && this.page.update)
      this.page.update()

    if(this.canvas && this.canvas.update)
      this.canvas.update(this.page.scroll)

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  /*
  *
  ** LISTENERS.
  *
  */

  addEventListeners()
  {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('wheel', this.onWheel.bind(this))
    window.addEventListener('mousemove', this.onMove.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners()
  {
    const links = document.querySelectorAll('a')

    each(links, link =>
    {
      link.onclick = event =>
      {
        event.preventDefault()

        const { href } = link
        this.onChange({ url: href })
      }
    })

    const outside_links = document.querySelectorAll('.outside__link')

    each(outside_links, link =>
    {
      link.onclick = event =>
      {
        const target = link.querySelector('a')
        window.open(target.href, '_blank')
      }
    })
  }
}

new App()