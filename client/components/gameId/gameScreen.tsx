import { useEffect } from 'react';

export default function gameScreen({
  gameProps: { users, userCards, stack, cards, turn, quantity, typeCard },
  setGameProps,
  socket,
}): JSX.Element {
  useEffect(() => {
    /* socket.on('card_played', ({ card, turn, quantity }) => {
    });

    socket.on('card_taked', ({ turn, quantity }) => {
    }); */

    socket.on('type_changed', (type: string) => {
      setGameProps({ users, userCards, stack, cards, turn, quantity, typeCard: type });
    });

    socket.on('shuffled', (cards: []) => {
      setGameProps({ users, userCards, stack, cards, turn, quantity, typeCard });
    });
  });

  return (
    <div>
      <h1>game</h1>
      <h3>turn: {users[turn]}</h3>
      <p>{users}</p>

      <div>
        <p>stack</p>
        <img src={`/cards/${stack[0]}.jpg`} />
      </div>

      <div>
        {userCards.map((card: any) => <img key={card} src={`/cards/${card}.jpg`} width={144} height={200} />)}
      </div>
    </div>
  );
}
