import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container, Input, Button, Span, Form } from './styles/CreateStyles';

// TODO: import from config
const uri = 'http://localhost:8001';

export default function Create(): JSX.Element {
  const router = useRouter();
  const [inputPassword, setInputPassword]: [string, any] = useState('');
  const [loading, setLoading]: [string, any] = useState('');

  const handleSubmit = async (event: any): Promise<void> => {
    event.preventDefault();
    try {
      const username = sessionStorage.getItem('username');
      if (!username) {
        alert('Username not found');
        router.push('/');
      }

      setLoading(true);
      const newRoom: any = await axios.post(
        uri.concat('/room/create'),
        { username, password: inputPassword },
      );
      setLoading(false);

      if (!newRoom || !newRoom.id) throw Error('error');

      router.push(`/game/${newRoom.id}`);
    } catch (error) {
      alert('Error ocurred :(');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Span>Create Room</Span>

      <Form action="" onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Password"
          onChange={(e: any) => setInputPassword(e.target.value)}
        />
        <Button type="submit" disabled={loading}>Create</Button>
      </Form>
    </Container>
  );
}
