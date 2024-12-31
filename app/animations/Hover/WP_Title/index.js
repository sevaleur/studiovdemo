import gsap from 'gsap'
import Splitting from 'splitting'

export default class WP_Title 
{
  constructor(element)
  {
    this.element = element 

    Splitting({
      target: this.element, 
      by: 'chars'
    })

    this.chars = this.element.querySelectorAll('.char')

    this.createAnimation()
  }

  createAnimation()
  {
    this.onSelection = gsap.fromTo(
      this.chars,
      {
        opacity: 0.0,
      }, 
      {
        opacity: 1.0, 
        duration: 1.0,
        delay: 0.2,
        stagger: 0.02,  
        ease: 'expo.inOut', 
        paused: true 
      }
    )
  }

  show()
  {
    this.onSelection.play()
  }

  hide()
  {
    this.onSelection.reverse()
  }
}