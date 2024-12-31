import gsap from 'gsap'

import Animation from 'classes/Animation'

export default class YAlpha extends Animation
{
  constructor({element, elements})
  {
    super({
      element,
      elements
    })

    this.finished = false 
    this.createAnimations()
  }

  createAnimations()
  {
    this.onShow = gsap.fromTo(
      this.element, 
      {
        y: '100%', 
        opacity: 0.0
      }, 
      {
        y: '0%', 
        opacity: 1.0, 
        duration: 1.0, 
        ease: 'expo.inOut', 
        paused: true, 
        onComplete: () => 
        {
          this.finished = true
        }
      }
    )
  }

  onEnter()
  {
    this.onShow.play()
  }

  onLeave()
  {
    this.onShow.reverse()
  }
}