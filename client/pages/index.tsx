import Head from 'next/head';
import LinkRoute from 'next/link';
import { Container, Link, Main, Img, Buttons } from '../style/indexStyle';

export default function Home(): JSX.Element {
  return (
    <Container>
      <Head>
        <title>Mago, Card Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Img src="/joker.png" alt="joker" />
        <h1>Mago</h1>
        <Buttons>
          <LinkRoute href="/rooms">
            <Link>Jugar</Link>
          </LinkRoute>
        </Buttons>
      </Main>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </Container>
  );
}
