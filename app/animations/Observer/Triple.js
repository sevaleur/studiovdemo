import gsap from 'gsap'

import Animation from 'classes/Animation'

export default class Triple extends Animation
{
  constructor({element, elements, top, left, alpha})
  {
    super({
      element,
      elements
    })

    this.finished = false 
    this.createAnimations(top, left, alpha)
  }

  createAnimations(top, left, alpha)
  {
    this.onShow = gsap.fromTo(
      this.element, 
      {
        top: '50%',
        left: '50%', 
        opacity: 0.0
      }, 
      {
        top: `${top}%`, 
        left: `${left}%`, 
        opacity: alpha, 
        duration: 1.0, 
        delay: 0.5,
        ease: 'power2.inOut', 
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