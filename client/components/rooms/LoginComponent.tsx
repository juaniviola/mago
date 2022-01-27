import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container, Input, Button, Span, FormColumn } from './styles/CreateStyles';

// TODO: import from config
const uri = 'http://localhost:8001';

export default function Login(): JSX.Element {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput]: [string, any] = useState('');
  const [passwordInput, setPasswordInput]: [string, any] = useState('');
  const [loading, setLoading]: [string, any] = useState('');

  const handleSubmit = async (event: any): Promise<void> => {
    event.preventDefault();
    try {
      if (!roomIdInput) return;

      setLoading(true);
      const login: any = await axios.post(
        uri.concat('/room/login'),
        { roomId: roomIdInput, password: passwordInput },
      );
      setLoading(false);

      if (!login || !login.logged) {
        alert('Invalid credentials');
        setRoomIdInput('');
        setPasswordInput('');
        return;
      }

      router.push(`/game/${roomIdInput}`);
    } catch (error) {
      alert('Error ocurred :(');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Span>Enter Room</Span>

      <FormColumn action="" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Room Id"
          onChange={(e: any) => setRoomIdInput(e.target.value)} />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e: any) => setPasswordInput(e.target.value)} />
        <Button type="submit" disabled={loading}>Login</Button>
      </FormColumn>
    </Container>
  );
}
