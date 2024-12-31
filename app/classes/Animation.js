import Component from 'classes/Component'

export default class Animation extends Component
{
  constructor({ element, elements })
  {
    super({
      element,
      elements
    })

    this.createObserver()
  }

  createObserver()
  {
    this.observer = new IntersectionObserver(entries =>
    {
      entries.forEach(entry =>
      {
        if(entry.isIntersecting)
        {
          this.onEnter()
        }
        else
        {
          this.onLeave()
        }
      })
    })

    this.observer.observe(this.element)
  }

  onEnter()
  {

  }

  onLeave()
  {

  }

  onResize()
  {
    
  }
}
