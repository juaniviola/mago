import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Stack = styled.div`
  text-align: center;
  margin-bottom: 3%;
`;

const Cards = styled.div`
  text-align: center;
  overflow: auto;
  white-space: nowrap;
  margin-bottom: 20px;
`;

const Img = styled.img`
  opacity: ${props => props.disabled ? '0.5' : '1'};

  &:hover {
    cursor: ${props => props.disabled ? 'default' : 'pointer'};
    width: ${props => props.disabled ? '144px' : '150px'};
    height: ${props => props.disabled ? '200px' : '215px'};
  }
`;

export default function gameScreen({
  gameProps: { users, userCards, stack, cards, turn, quantity, typeCard },
  setGameProps,
  socket,
}): JSX.Element {
  const [username, setUsername]: [string, any] = useState('');

  const handleChangeTypeCard = (): string => {
    const type = prompt('Type: oro or espada or basto or copa');
    return type;
  };

  const handlePlayCard = (card: string): void => {
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
        socket.emit('play_card', { stack: [card, ...stack], turn: newTurn, quantity: userCardNumber === '07' ? quantity + 1 : quantity + 2 });
        break;
      case '04':
      case '11':
        newTurn = newTurn + 1 === users.length ? 0 : newTurn + 1;
        socket.emit('play_card', { stack: [card, ...stack], turn: newTurn, quantity });
        break;
      case '10':
        const newType = handleChangeTypeCard();
        socket.emit('change_type', { type: newType, stack: [card, ...stack], turn: newTurn });
        newTypeCard = newType;
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

    setGameProps({ userCards: [...newCards], stack: [card, ...stack], turn: newTurn, typeCard: newTypeCard });
  };

  const handleTakeCard = (): void => {
    if (quantity >= cards.length) {
      socket.emit('shuffle', cards);
      return;
    }

    const cardToTake = cards.slice(0, quantity === 0 ? 1 : quantity);
    const restCards = cards.slice(quantity === 0 ? 1 : quantity);

    const newTurn = turn + 1 === users.length ? 0 : turn + 1;
    socket.emit('take_card', { turn: newTurn, quantity, cards: restCards });

    setGameProps({ userCards: [...userCards, ...cardToTake], cards: [...restCards], turn: newTurn, quantity: 0 });
  };

  useEffect(() => {
    setUsername(sessionStorage.getItem('username'));

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
  }, []);

  return (
    <div>
      <h1>game</h1>
      <p>Users: {users.map((user: any) => <span key={user}>{user} , </span>)}</p>
      <h3>turn: {users[turn]} {users[turn] === username ? '✅' : '❌'}</h3>

      <Stack>
        <p>{typeCard}</p>
        <p>stack</p>
        <img src={`/cards/${stack[0]}.jpg`} />
      </Stack>

      <div>
        <button onClick={handleTakeCard}>Take Card</button>
      </div>

      <Cards>
        {userCards.map((card: any) => <Img
          disabled={username !== users[turn]}
          key={card}
          src={`/cards/${card}.jpg`}
          width={144}
          height={200}
          onClick={() => username !== users[turn] ? null : handlePlayCard(card)}
        />)}
      </Cards>
    </div>
  );
}
