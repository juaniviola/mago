import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Connect from '../../components/gameId/connection';

export default function Game(): JSX.Element {
  const router = useRouter();
  const [gameId, setGameId]: [string, any] = useState('');

  useEffect((): void => {
    setGameId(router.query.gameId);

    //  FIXME: get username and change connect name
    Connect(gameId, sessionStorage.getItem('username'));
  }, []);

  return (
    <div>
      <h1>gid: {gameId}</h1>
    </div>
  );
}
