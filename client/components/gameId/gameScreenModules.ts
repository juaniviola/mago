const handleChangeTypeCard = (userType: string): string => {
  const type = prompt('Type: oro or espada or basto or copa');
  if (type !== 'oro' && type !== 'espada' && type	!== 'copa' && type !== 'basto')
    return userType;

  return type;
};

export const playCard = ({
  gameProps: { users, userCards, stack, turn, quantity, typeCard },
  setGameProps,
  socket,
  card,
  username,
}): void => {
  const typeCardUser = card.slice(3);

  const userCardNumber = card.slice(0, 2);
  const stackCardNumber = stack[0].slice(0, 2);

  const canFightBack = userCardNumber === '07' || userCardNumber === '12';
  if (quantity > 0 && !canFightBack) {
    alert('Invalid card');
    return;
  }

  if (typeCard !== typeCardUser && stackCardNumber !== userCardNumber) {
    alert('Invalid card');
    return;
  }

  let newTurn = turn + 1 === users.length ? 0 : turn + 1;
  let newTypeCard = typeCardUser;

  switch(userCardNumber) {
    case '07':
    case '12':
      socket.emit('play_card', {
        stack: [card, ...stack],
        turn: newTurn,
        quantity: userCardNumber === '07' ? quantity + 1 : quantity + 2,
      });
      break;
    case '04':
    case '11':
      newTurn = newTurn + 1 === users.length ? 0 : newTurn + 1;
      socket.emit('play_card', { stack: [card, ...stack], turn: newTurn, quantity });
      break;
    case '10':
      const newType = handleChangeTypeCard(typeCardUser);
      newTypeCard = newType;
      socket.emit('change_type', { type: newType, stack: [card, ...stack], turn: newTurn });
      break;
    default:
      socket.emit('play_card', { stack: [card, ...stack], turn: newTurn, quantity: 0 });
      break;
  }

  const newCards = userCards.filter((eachCard: string) => eachCard !== card);
  if (newCards.length === 0) {
    socket.emit('winner', username);
    setGameProps({ winner: username });
  }

  setGameProps({
    userCards: [...newCards],
    stack: [card, ...stack],
    turn: newTurn,
    typeCard: newTypeCard,
  });
};

export const takeCard = ({
  gameProps: { users, userCards, cards, turn, quantity },
  setGameProps,
  socket,
}): void => {
  if (quantity >= cards.length) {
    socket.emit('shuffle', cards);
    return;
  }

  const cardToTake = cards.slice(0, quantity === 0 ? 1 : quantity);
  const restCards = cards.slice(quantity === 0 ? 1 : quantity);

  const newTurn = turn + 1 === users.length ? 0 : turn + 1;
  socket.emit('take_card', { turn: newTurn, quantity, cards: restCards });

  setGameProps({
    userCards: [...userCards, ...cardToTake],
    cards: [...restCards],
    turn: newTurn,
    quantity: 0,
  });
};

export const gameListeners = (socket: any, setGameProps: any): void => {
  socket.on('card_taked', ({ turn, cards }: any) => setGameProps({ cards, turn, quantity: 0 }));
  socket.on('shuffled', (cards: []) => setGameProps({ cards }));
  socket.on('winner', (userWinner: string) => setGameProps({ winner: userWinner }));
  socket.on('card_played', ({ stack, turn, quantity }: any) => setGameProps({
    stack,
    turn,
    quantity,
    typeCard: stack[0].slice(3),
  }));
  socket.on('type_changed', ({ type, stack, turn }: any) => setGameProps({
    typeCard: type,
    stack,
    turn,
  }));
};
