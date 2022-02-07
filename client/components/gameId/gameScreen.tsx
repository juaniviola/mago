import { useState, useEffect } from 'react';
import { Stack, Cards, Img, ContainerTakeCard } from './gameScreenStyle';
import { playCard, takeCard, gameListeners } from './gameScreenModules';

export default function gameScreen({
  gameProps: { users, userCards, stack, cards, turn, quantity, typeCard },
  setGameProps,
  socket,
}): JSX.Element {
  const [username, setUsername]: [string, any] = useState('');

  const handlePlayCard = (card: string) => playCard({
    gameProps: { users, userCards, stack, turn, quantity, typeCard },
    setGameProps,
    socket,
    card,
    username,
  });

  const handleTakeCard = () => takeCard({
    gameProps: { users, userCards, cards, turn, quantity },
    setGameProps,
    socket,
  });

  useEffect(() => {
    setUsername(sessionStorage.getItem('username'));
    // listeners for updates
    gameListeners(socket, setGameProps);
  }, []);

  return (
    <div>
      <div>
        <p>Users: {users.map((user: any) => <span key={user}>{user} , </span>)}</p>
        <h3>turn: {users[turn]} {users[turn] === username ? '✅' : '❌'}</h3>
      </div>

      <Stack>
        <p><b>Type card: </b>{typeCard}</p>
        <img
          src={`/cards/${stack[0]}.jpg`}
          width={144}
          height={200}
          alt={`/cards/${stack[0]}.jpg`}
        />
      </Stack>

      <ContainerTakeCard>
        <button
          onClick={() => username !== users[turn] ? null : handleTakeCard()}
          disabled={username !== users[turn]}
        >Take Card</button>
      </ContainerTakeCard>

      <Cards>
        {userCards.map((card: any) => <Img
          disabled={username !== users[turn]}
          key={card}
          src={`/cards/${card}.jpg`}
          alt={`/cards/${card}.jpg`}
          width={144}
          height={200}
          onClick={() => username !== users[turn] ? null : handlePlayCard(card)}
        />)}
      </Cards>
    </div>
  );
}
