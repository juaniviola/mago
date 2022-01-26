import { useState } from 'react';
import { Container, Information, Button, H3, ButtonContainer } from './styles/ListStyle';

export default function List({ roomId, users }): JSX.Element {
  return (
    <Container>
      <Information>
        <H3>Room: {roomId}</H3>
        <b>{users} 👥</b>
      </Information>

      <ButtonContainer>
        <Button href="#">Enter</Button>
      </ButtonContainer>
    </Container>
  );
}
