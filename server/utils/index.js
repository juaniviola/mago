import cards from './cards';

const randomCard = (cpCards) => Math.floor((Math.random() * (cpCards.length)));

const randomCards = (users) => {
  const cpCards = [...cards].sort(() => 0.5 - Math.random());
  const userCards = {};

  users.forEach((user) => {
    userCards[user] = cpCards.splice(0, 5);
  });

  const randomPosition = randomCard(cpCards);
  const stack = [cpCards[randomPosition]];
  cpCards.splice(randomPosition, 1);

  return {
    userCards,
    cards: cpCards,
    stack,
  };
}

const mixCards = (stack) => {
  return stack.sort(() => 0.5 - Math.random());
}

export default {
  randomCards,
  mixCards,
};
