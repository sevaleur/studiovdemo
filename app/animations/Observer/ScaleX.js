import gsap from 'gsap'

import Animation from 'classes/Animation'

export default class ScaleX extends Animation
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
        scaleX: 0.0, 
      }, 
      {
        scaleX: 1.0,
        duration: 1.0, 
        delay: 0.5,
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