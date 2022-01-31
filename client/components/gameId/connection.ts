import { io } from 'socket.io-client';

//TODO: import from config
const server = 'localhost:8001';

export default function useConnect(gameId: string, username: string): void {
  const socket = io(server.concat(`/${gameId}`), {
    transports: ['websocket'],
    forceNew: true,
  });

  socket.on('msg2', (message) => {
    console.log('>>', message);
  });

  socket.emit('msg', 'holi');
}
