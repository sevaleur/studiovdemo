import gsap from 'gsap'

import Component from "classes/Component"

import { DARK_GREY, LIGHT_GREY } from 'utils/colorVars'

export default class Navigation extends Component
{
  constructor({ template })
  {
    super({
      element: '.navigation',
      elements:
      {
        navLogo: '.navigation__logo',
        navSvg: 'svg',
        navLink: '.navigation__link',
        navLinks: '.navigation__link__href',
        navLinksText: '.navigation__link__href__text',
        navLinkActive: '.navigation__link__active',
        navContact: '.navigation__contact',
        navEmail: '.navigation__contact__email',
        navEmailActive: '.navigation__contact__email__active',
      },
    })

    this.template = template
    this.onChange(this.template)
  }

  create()
  {
    super.create()

    this.nav = {
      anim: {
        std: {},
        active: {},
        show: {}
      }
    }

    this.createAnimations()
  }

  createAnimations()
  {
    this.nav.anim.std.email = gsap.fromTo(
      this.elements.navEmailActive,
      {
        scaleX: 0,
      },
      {
        scaleX: 1.0,
        duration: 0.5,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.nav.anim.show.logo = gsap.fromTo(
      this.elements.navSvg,
      {
        yPercent: -100
      },
      {
        yPercent: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.nav.anim.show.contact = gsap.fromTo(
      this.elements.navContact,
      {
        opacity: 0.0,
      },
      {
        opacity: 1.0,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.nav.anim.show.links = gsap.fromTo(
      this.elements.navLinksText,
      {
        yPercent: 100
      },
      {
        yPercent: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.elements.navLinkActive.forEach(
      (border, idx) =>
      {
        this.nav.anim.active[idx] = gsap.fromTo(
          border,
          {
            scaleX: 0.0
          },
          {
            scaleX: 1.0,
            duration: 0.8,
            ease: 'power2.inOut',
            paused: true
          }
        )
      }
    )
  }

  onChange(template)
  {
    this.elements.navLinks.forEach(
      (link, idx) =>
      {
        link.dataset.path === template
          ? this.nav.anim.active[idx].play()
          : this.nav.anim.active[idx].reverse()
      }
    )
  }

  onMouseOver()
  {
    this.nav.anim.std.email.play()
  }

  onMouseLeave()
  {
    this.nav.anim.std.email.reverse()
  }

  show()
  {
    this.nav.anim.show.logo.play()
    this.nav.anim.show.contact.play()
    this.nav.anim.show.links.play()
  }

  addEventListeners()
  {
    super.addEventListeners()

    this.elements.navEmail.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.elements.navEmail.addEventListener('mouseleave', this.onMouseLeave.bind(this))
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    this.elements.navEmail.removeEventListener('mouseover', this.onMouseOver)
    this.elements.navEmail.removeEventListener('mouseleave', this.onMouseLeave)
  }
}