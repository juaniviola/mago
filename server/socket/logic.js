import shortid from 'shortid';
import database from '../db';
import cardUtils from '../utils';

const { randomCards } = cardUtils;
const { User, Room } = database;

export default function (io, socket) {
  socket.on('new_player', async ({ roomId, username }) => {
    let user = null;
    const getUser = await User.get({ roomId, username });

    if (Object.keys(getUser || {}).length < 1) {
      user = username;
    } else {
      user = username.concat(shortid.generate());
    }

    await User.set({ roomId, username: user, socketId: socket.id });

    io.to(socket.id).emit('username', user);
    io.emit('user_connected', user);
  });

  socket.on('start_match', async (roomId) => {
    await Room.updateStatus({ roomId, started: true });
    const usersFromRoom = await User.getFromRoom(roomId);

    const users = Object.keys(usersFromRoom);
    const { userCards, cards, stack } = randomCards(users);

    Object.entries(usersFromRoom).forEach(([user, socketId]) => {
      io.to(socketId).emit('cards', userCards[user]);
    });

    io.emit('start_match', { users, stack, cards, turn: 0 });
  });

  socket.on('winner', (winner) => socket.broadcast.emit('winner', winner));

  socket.on('play_again', () => io.emit('new_game'));

  socket.on('disconnect', async () => {
    const roomId = socket.nsp.name;
    const usersFromRoom = await User.getFromRoom(roomId);

    if (Object.keys(usersFromRoom || {}).length === 1) {
      await Room.remove(roomId);
      await User.removeOwner(roomId);
      await User.remove({ roomId, username: Object.keys(usersFromRoom)[0] });

      return;
    }

    const users = Object.keys(usersFromRoom)
      .filter((username) => usersFromRoom[username] !== socket.id);

    io.emit('user_disconnected', users);
  });
}
