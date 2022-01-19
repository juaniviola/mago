import cards from './cards';

const randomCard = (cpCards) => Math.floor((Math.random() * (cpCards.length)));

const randomCards = (users) => {
  const cpCards = [...cards];
  const userCards = {};

  users.forEach((user) => {
    for (let i = 0; i < 5; i += 1) {
      const randomPosition = randomCard(cpCards);

      if (!Array.isArray(userCards[user])) userCards[user] = [cpCards[randomPosition]];
      else userCards[user].push(cpCards[randomPosition]);

      cpCards.splice(randomPosition, 1);
    }
  });

  const randomPosition = randomCard();
  const stack = [cpCards[randomPosition]];
  cpCards.splice(randomPosition, 1);

  return {
    userCards,
    cards: cpCards,
    stack,
  };
}

const mixCards = (stack) => {
  const oldStack = [...stack];
  const newStack = [];

  stack.forEach(() => {
    const randomPosition = randomCard(oldStack);
    newStack.push(oldStack[randomPosition]);
    oldStack.splice(randomPosition, 1);
  });

  return newStack;
}

export default {
  randomCards,
  mixCards,
};
