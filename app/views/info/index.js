import Page from 'classes/Page'

import { SUGAR_WHITE, BLACK_OAK } from 'utils/colorVars'

export default class Info extends Page
{
  constructor()
  {
    super({
      element: '.info',
      elements: {
        title: '.info__title'
      },
      background: BLACK_OAK,
      color: SUGAR_WHITE
    })
  }

  create()
  {
    super.create()
  }

  show()
  {
    super.show()
  }

  hide()
  {
    super.hide()
  }

  addEventListeners()
  {
    super.addEventListeners()
  }

  removeEventListeners()
  {
    super.removeEventListeners()
  }
}