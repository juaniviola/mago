import io from 'socket.io-client';

//TODO: import from config
const server = 'ws://localhost:8001';

export default function Connect(gameId: string, username: string): void {
  const socket = io(server.concat(`/${gameId}`));

  socket.on('msg2', (msg: string) => console.log('>>', msg));

  socket.emit('msg', 'holi');
}
