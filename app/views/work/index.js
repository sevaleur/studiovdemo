import gsap from 'gsap'

import Page from 'classes/Page'
import YDown from 'animations/Show/YDown'

import { SUGAR_WHITE, BLACK_OAK } from 'utils/colorVars'

export default class Work extends Page
{
  constructor()
  {
    super({
      element: '.work',
      elements: {
        menu: '.work__menu',
        elements: '.work__menu__element',
        elementTypes: '.work__menu__element__title',
        elementTypesText: '.work__menu__element__title__text',
        elementAreas: '.work__menu__element__area',
        elementBorders: '.work__menu__element__border',
        elementBordersLeft: '.work__menu__element__left',
        elementBordersRight: '.work__menu__element__right',
        selected: '.work__selected',
        selectedArticles: '.work__selected__element',
        selectedTitles: '.work__selected__element__lh__text__title__text',
        selectedDetails: '.work__selected__element__lh__text__details__detail',
        selectedDescription: '.work__selected__element__rh__description__text',
        selectedLocation: '.location',
        selectedArea: '.area',
        selectedCompletion: '.completion',
        backBtn: '.work__selected__back'
      },
      background: SUGAR_WHITE,
      color: BLACK_OAK
    })
  }

  create()
  {
    super.create()

    this.work = {
      selected: false,
      anims: {
        std: {},
        onSelect: {},
        onScaleBorder: {},
        onScaleArea: {},
        onActiveLeft: {},
        onActiveRight: {},
        onFade: {},
        yUp: {},
        selected: {
          yDown: {},
          desc: {},
          details: {},
          comp: {}
        },
        fIdx: null
      }
    }

    this.createAnimations()
  }

  createAnimations()
  {
    this.work.anims.std.fade = gsap.fromTo(
      this.elements.menu,
      {
        opacity: 1.0,
      },
      {
        opacity: 0.0,
        duration: 0.5,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.work.anims.std.scale = gsap.fromTo(
      this.elements.backBtn,
      {
        scale: 0,
      },
      {
        scale: 1.0,
        duration: 0.8,
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.elements.elements.forEach(
      (element, idx) =>
      {
        this.work.anims.onScaleBorder[idx] = gsap.fromTo(
          this.elements.elementBorders[idx],
          {
            scaleX: 0.0
          },
          {
            scaleX: 1.0,
            delay: 0.2,
            duration: 0.8,
            ease: 'power2.inOut',
            paused: true
          }
        )



        this.work.anims.onScaleArea[idx] = gsap.fromTo(
          this.elements.elementAreas[idx],
          {
            scale: 0.0,
          },
          {
            scale: 1.0,
            duration: 0.8,
            ease: 'power2.inOut',
            paused: true
          }
        )

        this.work.anims.onActiveLeft[idx] = gsap.fromTo(
          this.elements.elementBordersLeft[idx],
          {
            scaleX: 0
          },
          {
            scaleX: 1.0,
            duration: 0.8,
            ease: 'power2.inOut',
            paused: true
          }
        )

        this.work.anims.onActiveRight[idx] = gsap.fromTo(
          this.elements.elementBordersRight[idx],
          {
            scaleX: 0
          },
          {
            scaleX: 1.0,
            duration: 0.8,
            ease: 'power2.inOut',
            paused: true
          }
        )

        this.work.anims.onFade[idx] = gsap.fromTo(
          [
            this.elements.elementTypes[idx],
            this.elements.elementAreas[idx]
          ],
          {
            opacity: 1.0,
          },
          {
            opacity: 0.0,
            duration: 0.5,
            ease: 'power2.inOut',
            paused: true
          }
        )

        this.work.anims.yUp[idx] = gsap.fromTo(
          this.elements.elementTypesText[idx],
          {
            yPercent: 100
          },
          {
            yPercent: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.inOut',
            paused: true
          }
        )

        this.work.anims.selected.yDown[idx] = gsap.fromTo(
          this.elements.selectedTitles[idx],
          {
            yPercent: -110
          },
          {
            yPercent: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.inOut',
            paused: true
          }
        )

        this.work.anims.selected.desc[idx] = new YDown({
          element: this.elements.selectedDescription[idx]
        })

        this.work.anims.selected.details[idx] = gsap.fromTo(
          [
            this.elements.selectedLocation,
            this.elements.selectedArea,
          ],
          {
            yPercent: -110
          },
          {
            yPercent: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            paused: true
          }
        )

        this.work.anims.selected.comp[idx] = gsap.fromTo(
          this.elements.selectedCompletion[idx],
          {
            yPercent: -110
          },
          {
            yPercent: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            paused: true
          }
        )

        this.work.anims.onSelect[idx] = gsap.fromTo(
          [
            this.elements.selected,
            this.elements.selectedArticles[idx],
          ],
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

  onMouseOver(element, idx)
  {
    this.work.anims.onActiveLeft[idx].play()
    this.work.anims.onActiveRight[idx].play()
  }

  onMouseLeave(element, idx)
  {
    this.work.anims.onActiveLeft[idx].reverse()
    this.work.anims.onActiveRight[idx].reverse()
  }

  onSelect(element, idx)
  {
    this.elements.backBtn.dataset.active = false
    element.dataset.selected=true

    for(const [key, value] of Object.entries(this.work.anims.yUp))
    {
      value.reverse()
      this.work.anims.onScaleBorder[key].reverse()
      this.work.anims.onScaleArea[key].reverse()
    }

    this.work.anims.onSelect[idx].play()
    this.work.anims.std.scale.play()
    this.work.anims.std.fade.play()
      .eventCallback(
        'onComplete', () =>
        {
          this.elements.menu.style.display = 'none'

          this.work.anims.selected.yDown[idx].play()

          gsap.delayedCall(
            0.2, () =>
            {
              this.elements.selectedCompletion.forEach(
                (el, idx) =>
                {
                  if(el.dataset.article === element.dataset.article)
                    this.work.anims.selected.comp[idx].play()
                }
              )

              this.work.anims.selected.desc[idx].play()
              this.work.anims.selected.details[idx].play()
            }
          )
        }
      )

    this.work.anims.fIdx = idx
  }

  onBack()
  {
    this.elements.backBtn.dataset.active = true
    this.work.anims.std.scale.reverse()

    this.elements.elements[this.work.anims.fIdx].dataset.selected = false
    this.elements.menu.style.display = 'block'

    this.elements.selectedCompletion.forEach(
      (el, idx) =>
      {
        if(el.dataset.article === this.elements.elements[this.work.anims.fIdx].dataset.article)
          this.work.anims.selected.comp[idx].reverse()
      }
    )

    this.work.anims.selected.details[this.work.anims.fIdx].reverse()
    this.work.anims.selected.desc[this.work.anims.fIdx].reverse()
    this.work.anims.selected.yDown[this.work.anims.fIdx].reverse()
      .eventCallback(
        'onReverseComplete', () =>
        {
          this.elements.backBtn.dataset.active = false
          this.work.anims.onSelect[this.work.anims.fIdx].reverse()

          for(const [key, value] of Object.entries(this.work.anims.yUp))
          {
            value.play()
            this.work.anims.onScaleBorder[key].play()
            this.work.anims.onScaleArea[key].play()
          }

          this.work.anims.std.fade.reverse()
            .eventCallback(
              'onReverseComplete', () =>
              {
                this.work.anims.fIdx = null
              }
            )
        }
      )
  }

  show()
  {
    super.show()

    for(const [key, value] of Object.entries(this.work.anims.onScaleBorder))
    {
      value.play()
        .eventCallback(
          'onComplete', () =>
          {
            this.work.anims.onScaleArea[key].play()
            this.work.anims.yUp[key].play()
          }
        )
    }
  }

  hide()
  {
    super.hide()

    for(const [key, value] of Object.entries(this.work.anims.yUp))
    {
      value.reverse()
      this.work.anims.onScaleArea[key].reverse()
      this.work.anims.onScaleBorder[key].reverse()
    }
  }

  addEventListeners()
  {
    super.addEventListeners()

    this.elements.elements.forEach(
      (element, idx) =>
      {
        element.addEventListener('mouseover', this.onMouseOver.bind(this, element, idx))
        element.addEventListener('mouseleave', this.onMouseLeave.bind(this, element, idx))
        element.addEventListener('click', this.onSelect.bind(this, element, idx))
      }
    )

    this.elements.backBtn.addEventListener('click', this.onBack.bind(this))
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    this.elements.elements.forEach(
      (element, idx) =>
      {
        element.removeEventListener('mouseover', this.onMouseOver)
        element.removeEventListener('mouseleave', this.onMouseLeave)
        element.removeEventListener('click', this.onSelect)
      }
    )

    this.elements.backBtn.removeEventListener('click', this.onBack)
  }
}