import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import database from '../../db';
import socketLogic from '../../socket';

describe('logic', () => {
  let io, client, port, newRoom;

  beforeAll(async () => {
    await database.connect({ force: true });
    newRoom = await database.Room.create({ password: 'password' });
  });

  beforeAll((done) => {
    const http = createServer();
    io = new Server(http);

    http.listen(() => {
      socketLogic(io.of(`/${newRoom.id}`));

      port = http.address().port;
      client = new Client(`http://localhost:${port}/${newRoom.id}`);

      client.on('connect', done);
    });
  });

  it('(msg) call', (done) => {
    client.on('msg2', (msg) => {
      expect(msg).toBe('world');
      done();
    });
    client.emit('msg', 'world');
  });

  it('(new_player) call', (done) => {
    client.on('username', (username) => {
      expect(username).toEqual('foobar');
      done();
    });

    client.emit('new_player', { roomId: newRoom.id, username: 'foobar' });
  });

  it('(start_match) call', (done) => {
    client.on('cards', (cards) => {
      expect(cards.length).toBe(5);
    });

    client.on('start_match', ({ users, stack, cards, turn }) => {
      expect(turn).toBe(0);
      expect(users[0]).toEqual('foobar');
      expect(stack.length).toBe(1);
      expect(cards.length).toBe(34); // 40 cards - 1 user (-5), stack (-1)

      done();
    });

    client.emit('start_match', newRoom.id);
  });
});
