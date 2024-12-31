import gsap from 'gsap'
import Splitting from 'splitting'

export default class YDown
{
  constructor({ element })
  {
    this.element = element

    this.split = Splitting({
      by: 'lines',
      target: element
    })

    this.lines = this.split[0].lines

    this.createAnimation()
  }

  createAnimation()
  {
    this.show = gsap.fromTo(
      this.lines,
      {
        scaleY: 0,
        yPercent: -100
      },
      {
        scaleY: 1.0,
        yPercent: 0,
        delay: 0.2,
        ease: 'power2.inOut',
        paused: true
      }
    )
  }

  play()
  {
    this.show.play()
  }

  reverse()
  {
    this.show.reverse()
  }
}