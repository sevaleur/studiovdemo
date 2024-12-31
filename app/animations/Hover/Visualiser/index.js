import gsap from 'gsap'

export default class Visualiser
{
  constructor(element, color)
  {
    this.element = element

    this.createAnimation(color)
  }

  createAnimation(color)
  {
    this.onHover = gsap.to(
      this.element,
    {
      background: color,
      duration: 0.5,
      ease: 'power2.inOut',
      paused: true
    })
  }

  show()
  { 
    this.onHover.play()
  }

  hide()
  {
    this.onHover.reverse() 
  }
}