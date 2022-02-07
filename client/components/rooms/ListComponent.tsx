import { useRouter } from 'next/router';
import { Container, Information, Button, H3, ButtonContainer } from './styles/ListStyle';

export default function List({ roomId, users }): JSX.Element {
  const router = useRouter();

  const handleEnterRoom = (): void => {
    router.push(`/game/${roomId}`);
  };

  return (
    <Container>
      <Information>
        <H3>Room: {roomId}</H3>
        <b>{users} 👥</b>
      </Information>

      <ButtonContainer>
        <Button href="#" onClick={handleEnterRoom}>Enter</Button>
      </ButtonContainer>
    </Container>
  );
}
