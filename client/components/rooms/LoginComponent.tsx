import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container, Input, Button, Span, FormColumn } from './styles/CreateStyles';
import { serverUrl } from '../../config';

export default function Login(): JSX.Element {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput]: [string, any] = useState('');
  const [passwordInput, setPasswordInput]: [string, any] = useState('');
  const [loading, setLoading]: [string, any] = useState('');

  const handleSubmit = async (event: any): Promise<void> => {
    event.preventDefault();
    const refRoomIdInput: any = document.getElementById('roomid');
    const refPasswordInput: any = document.getElementById('password');

    try {
      if (!roomIdInput) return;

      setLoading(true);
      const login: any = await axios.post(
        serverUrl.concat('/room/login'),
        { roomId: roomIdInput, password: passwordInput },
      );
      setLoading(false);

      if (!login || !login.data || !login.data.logged) {
        alert('Invalid credentials');
        refRoomIdInput.value = '';
        refPasswordInput.value = '';
        return;
      }

      router.push(`/game/${roomIdInput}`);
    } catch (error) {
      alert('Error ocurred :(');
      setLoading(false);
    } finally {
      refRoomIdInput.value = '';
      refPasswordInput.value = '';
    }
  };

  return (
    <Container>
      <Span>Enter Room</Span>

      <FormColumn action="" onSubmit={handleSubmit}>
        <Input
          id="roomid"
          type="text"
          placeholder="Room Id"
          onChange={(e: any) => setRoomIdInput(e.target.value)} />
        <Input
          id="password"
          type="password"
          placeholder="Password"
          onChange={(e: any) => setPasswordInput(e.target.value)} />
        <Button type="submit" disabled={loading}>Login</Button>
      </FormColumn>
    </Container>
  );
}
