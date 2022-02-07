import { useState, useEffect } from 'react';
import { Container } from './styles/waitingScreenStyle';
import { Button } from './styles/gameScreenStyle';

export default function waitingScreen({ socket, roomId }): JSX.Element {
  const [isOwner, setIsOwner]: [boolean, any] = useState(false);

  const handleStart = () => {
    socket.emit('start_match', roomId);
  };

  useEffect(() => {
    const getOwner = sessionStorage.getItem('isOwner');
    if (!getOwner) return;

    setIsOwner(true);
  });

  return (
    <Container>
      <h3>Esperando jugadores...</h3>
      {isOwner ? <Button onClick={handleStart}>Comenzar</Button> : null}
    </Container>
  );
}
