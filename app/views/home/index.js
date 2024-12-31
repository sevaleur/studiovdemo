import gsap from 'gsap'

import Page from 'classes/Page'

import { SUGAR_WHITE, BLACK_OAK } from 'utils/colorVars'

export default class Home extends Page
{
  constructor()
  {
    super({
      element: '.home',
      elements: {
        title: '.home__title',
        element: '.home__showcase__element',
        articles: '.home__selected__element',
        back: '.home__selected__back',
      },
      background: SUGAR_WHITE,
      color: BLACK_OAK
    })
  }

  create()
  {
    super.create()

    this.home = {
      selected: false,
      anims: {
        std: {},
        onSelect: {},
        fIdx: null
      }
    }

    this.createAnimations()
  }

  createAnimations()
  {
    this.home.anims.std.fade = gsap.fromTo(
      this.elements.title,
      {
        opacity: 0.0,
      },
      {
        opacity: 1.0,
        delay: 1.0,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.home.anims.std.back = gsap.fromTo(
      this.elements.back,
      {
        scale: 0,
      },
      {
        scale: 1.0,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.elements.articles.forEach(
      (article, idx) =>
      {
        this.home.anims.onSelect[idx] = gsap.fromTo(
          article,
          {
            opacity: 0.0
          },
          {
            opacity: 1.0,
            ease: 'power2.inOut',
            paused: true
          }
        )
      }
    )
  }

  onSelect(el, idx)
  {
    this.home.selected = true
    el.dataset.active = true
    this.elements.back.dataset.active = false

    this.elements.element.forEach(
      el =>
      {
        el.style.display = 'none'
      }
    )

    if(this.home.anims.fIdx !== null)
      this.home.anims.onSelect[this.home.anims.fIdx].reverse()

    this.home.anims.std.fade.reverse()

    gsap.delayedCall(
      1.0, () =>
      {
        this.home.anims.std.back.play()
        this.home.anims.onSelect[idx].play()
      }
    )

    this.home.anims.fIdx = idx
  }

  onMouseOver(el, idx)
  {
    el.dataset.hovered = true
    el.dataset.leave = false
  }

  onMouseLeave(el, idx)
  {
    el.dataset.hovered = false
    el.dataset.leave = true
  }

  onBack()
  {
    this.elements.back.dataset.active = true
    this.home.anims.std.fade.play()

    this.home.anims.onSelect[this.home.anims.fIdx].reverse()
      .eventCallback(
        'onReverseComplete', () =>
        {
          this.home.anims.fIdx = null
        }
      )

    this.home.anims.std.back.reverse()
        .eventCallback(
          'onReverseComplete', () => this.elements.back.dataset.active = false
        )

    this.home.selected = false
    this.elements.element.forEach(
      el =>
      {
        el.dataset.active = false
        el.style.display = 'block'
      }
    )
  }

  show()
  {
    super.show()

    this.home.anims.std.fade.play()
  }

  hide()
  {
    super.hide()

    this.home.anims.std.fade.reverse()
  }

  addEventListeners()
  {
    super.addEventListeners()

    this.elements.element.forEach(
      (el, idx) =>
      {
        el.addEventListener('click', this.onSelect.bind(this, el, idx))
        el.addEventListener('mouseover', this.onMouseOver.bind(this, el, idx))
        el.addEventListener('mouseleave', this.onMouseLeave.bind(this, el, idx))
      }
    )

    this.elements.back.addEventListener('click', this.onBack.bind(this))
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    this.elements.element.forEach(
      (el, idx) =>
      {
        el.removeEventListener('click', this.onSelect)
        el.removeEventListener('mouseover', this.onMouseOver)
        el.removeEventListener('mouseleave', this.onMouseLeave)
      }
    )

    this.elements.back.removeEventListener('click', this.onBack)
  }
}