import { useState } from 'react';
import { Container, Input, Button, Span, Form } from './styles/CreateStyles';

export default function Create(): JSX.Element {
  return (
    <Container>
      <Span>Create Room</Span>

      <Form action="">
        <Input type="password" placeholder="Password" />
        <Button type="submit">Create</Button>
      </Form>
    </Container>
  );
}
