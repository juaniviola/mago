import { useState } from 'react';
import { Container, Input, Button, Span, FormColumn } from './styles/CreateStyles';

export default function Login(): JSX.Element {
  return (
    <Container>
      <Span>Enter Room</Span>

      <FormColumn action="">
        <div className="error"></div>

        <Input type="text" placeholder="Room Id" />
        <Input type="password" placeholder="Password" />
        <Button type="submit">Login</Button>
      </FormColumn>
    </Container>
  );
}
