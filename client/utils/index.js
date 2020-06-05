function verifyCard (stack) {
  const num = stack.slice(0, stack.indexOf('_'))
  if (num === '7' || num === '12') return true

  return false
}

function canTakeCard (stack, mazo) {
  const numStack = stack.slice(0, stack.indexOf('_'))
  const paloStack = stack.slice(stack.indexOf('_')+1, stack.length)

  for (let i in mazo) {
    const num = mazo[i].slice(0, mazo[i].indexOf('_'))

    if (num === numStack || (`7_${paloStack}` === mazo[i] || `12_${paloStack}` === mazo[i])) return true
  }

  return false
}

export default {
  verifyCard,
  canTakeCard
}