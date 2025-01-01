import gsap from 'gsap'

import Page from 'classes/Page'

import { SUGAR_WHITE, BLACK_OAK } from 'utils/colorVars'

export default class Info extends Page
{
  constructor()
  {
    super({
      element: '.info',
      elements: {
        title: '.info__text__title',
        subtitle: '.info__text__subtitle__text',
        desc: '.info__text__desc__text',
        media: '.info__media'
      },
      background: SUGAR_WHITE,
      color: BLACK_OAK
    })
  }

  create()
  {
    super.create()

    this.info = {
      anims: {
      }
    }

    this.createAnimations()
  }

  createAnimations()
  {
    this.fadeIn = gsap.fromTo(
      [
        this.elements.desc,
        this.elements.media,
        this.elements.title,
        this.elements.subtitle
      ],
      {
        opacity: 0.0
      },
      {
        opacity: 1.0,
        duration: 0.8,
        delay: 1.0,
        paused: true
      }
    )
  }

  show()
  {
    super.show()

    this.fadeIn.play()
  }

  hide()
  {
    super.hide()
  }

  addEventListeners()
  {
    super.addEventListeners()
  }

  removeEventListeners()
  {
    super.removeEventListeners()
  }
}