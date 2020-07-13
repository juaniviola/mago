'use strict'

const cards = require('./cards')

function randomCards (users)  {
  const userCards = {}
  for (let i in users) {
    for (let j = 0; j < 5; j++) {
      const x = Math.floor((Math.random() * (cards.length)))
      if (j !== 0)
        userCards[users[i]].push(cards[x])
      else
        userCards[users[i]] = [cards[x]]
      cards.splice(x, 1)
    }
  }

  const x = Math.floor((Math.random() * (cards.length)))
  const stack = [ cards[x] ]
  cards.splice(x, 1)

  return { userCards, cards, stack }
}

function mixCards (stack) {
  const nStack = []
  const oStack = stack

  for (let i in stack.length) {
    const x = Math.floor((Math.random() * (cards.length)))
    nStack.push(oStack[x])
    oStack.splice(x, 1)
  }

  return nStack
}

module.exports = {
  randomCards,
  mixCards
}