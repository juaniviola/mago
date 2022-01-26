import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import globalStyle from '../style/global';
import { Container, Link, Main, Img, ButtonContainer, Input } from '../style/indexStyle';

export default function Home(): JSX.Element {
  const router = useRouter();
  const [inputUsername, setInputUsername] = useState('');

  const handleKeyPress = (event: any): void => {
    if (event.key === 'Enter') handleSaveUsername();
  };

  const handleSaveUsername = (): void => {
    if (!inputUsername) return alert('Type username');

    sessionStorage.setItem('username', inputUsername);
    router.push('/rooms');
  };

  return (
    <Container>
      <Head>
        <title>Mago, Card Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Img src="/joker.png" alt="joker" />
        <h1>Mago</h1>
        <Input
          type="text"
          placeholder="username"
          onChange={(e: any) => setInputUsername(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <ButtonContainer>
          <Link onClick={handleSaveUsername}>Jugar</Link>
        </ButtonContainer>
      </Main>

      <style jsx global>{globalStyle}</style>
    </Container>
  );
}
