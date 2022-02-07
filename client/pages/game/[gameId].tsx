import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import startGameListeners from '../../components/gameId/modules/logicListeners';
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
    winner: '',
  });

  const handleSetGameProps = (updatedProps: any): void => {
    setGameProps((prevGamePropsState: any) => ({ ...prevGamePropsState, ...updatedProps }));
  };

  const handlePlayAgain = (): void => {
    socket.emit('play_again');
    setGameProps({
      gameStarted: false,
      users: [],
      userCards: [],
      stack: [],
      cards: [],
      turn: -1,
      quantity: 0,
      typeCard: null,
      winner: '',
    });
  };

  useEffect(() => {
    setGameId(router.query.gameId);
    const username = sessionStorage.getItem('username');

    const socketIo = io(server.concat(`/${gameId}`), {
      transports: ['websocket'],
      forceNew: true,
    });
    setSocket(socketIo);

    socketIo.emit('new_player', { roomId: gameId, username });
    socketIo.on('new_game', () => handlePlayAgain());
    startGameListeners(socketIo, handleSetGameProps);
  }, [gameId]);

  return (
    <div>
      {!gameProps.gameStarted ?
        <WaitingScreen roomId={gameId} socket={socket} /> :
        gameProps.winner ? <div><h1>Winner: {gameProps.winner}</h1><button onClick={handlePlayAgain}>Volver a jugar</button></div> :
        <GameScreen gameProps={gameProps} setGameProps={handleSetGameProps} socket={socket} />}
    </div>
  );
}
