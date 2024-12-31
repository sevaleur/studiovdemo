import gsap from 'gsap'
import Splitting from 'splitting'

import Animation from 'classes/Animation'

export default class LineSplitYAlpha extends Animation
{
  constructor({element, elements})
  {
    super({
      element,
      elements
    })

    this.split = Splitting({
      target: this.element,
      by: 'lines'
    })

    this.lines = this.split[0].lines

    this.finished = false
    this.createAnimations()
  }

  createAnimations()
  {
    this.lineAnimations = []

    this.lines.forEach( 
      (line, idx) => 
      {
        let onShow = gsap.fromTo(
          line, 
          {
            y: '100%', 
            opacity:0.0,
          }, 
          {
            y: '0%',
            duration: 1.0, 
            opacity: 1.0,
            delay: 0.02 * idx,
            ease: 'expo.inOut', 
            paused: true,
            onComplete: () => 
            {
              this.finished = true
            }
          }
        )

        this.lineAnimations.push(onShow)
      }
    )
  }

  onEnter()
  {
    this.lineAnimations.forEach(
      line => 
      {
        line.play()
      }
    )
  }

  onLeave()
  {
    this.lineAnimations.forEach(
      line => 
      {
        line.reverse()
      }
    )
  }
}