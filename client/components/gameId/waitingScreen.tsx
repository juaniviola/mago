import { useState, useEffect } from 'react';

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
    <div>
      <h3>Esperando jugadores...</h3>
      {isOwner ? <button onClick={handleStart}>Comenzar</button> : null}
    </div>
  );
}
