import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import startGameListeners from '../../components/gameId/logicListeners';
import WaitingScreen from '../../components/gameId/waitingScreen';
import GameScreen from '../../components/gameId/gameScreen';

export default function Game(): JSX.Element {
  const server = 'http://localhost:8001';
  const router = useRouter();
  const [gameId, setGameId]: [string, any] = useState('');
  const [socket, setSocket]: [any, any] = useState(null);

  // game props
  const [gameProps, setGameProps]: [any, any] = useState({
    gameStarted: false,
    users: [],
    userCards: [],
    stack: [],
    cards: [],
    turn: -1,
    quantity: 0,
    typeCard: null,
  });

  useEffect(() => {
    setGameId(router.query.gameId);
    const username = sessionStorage.getItem('username');

    const socketIo = io(server.concat(`/${gameId}`), {
      transports: ['websocket'],
      forceNew: true,
    });
    setSocket(socketIo);

    socketIo.emit('new_player', { roomId: gameId, username });
    startGameListeners(socketIo, setGameProps);
  }, [gameId]);

  return (
    <div>
      {!gameProps.gameStarted ?
        <WaitingScreen roomId={gameId} socket={socket} /> :
        <GameScreen gameProps={gameProps} setGameProps={setGameProps} socket={socket} />}
    </div>
  );
}
