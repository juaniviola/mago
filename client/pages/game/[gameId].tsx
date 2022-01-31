import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useConnect from '../../components/gameId/connection';

export default function Game(): JSX.Element {
  const router = useRouter();
  const [gameId, setGameId]: [string, any] = useState('');

  useEffect(() => {
    setGameId(router.query.gameId);

    useConnect(gameId, sessionStorage.getItem('username'));
  }, [gameId]);

  return (
    <div>
      <h1>gid: {gameId}</h1>
    </div>
  );
}
