import shortid from 'shortid';
import database from '../db';
import cardUtils from '../utils';

const { randomCards } = cardUtils;

export default function (io, socket) {
  socket.on('msg', (msg) => io.emit('msg2', msg));

  socket.on('new_player', async ({ roomId, username }) => {
    const getUser = await database.User.get({ roomId, username });

    const user = (!getUser || getUser.length < 1)
      ? username : username.concat('-'.concat(shortid.generate()));

    await database.User.set({ roomId, username: user, socketId: socket.id });

    io.to(socket.id).emit('username', user);
    socket.broadcast.emit('user_connected', user);
  });

  socket.on('start_match', async (roomId) => {
    await database.Room.updateStatus({ roomId, started: true });
    const usersFromRoom = await database.User.getFromRoom(roomId);

    const users = Object.keys(usersFromRoom);
    const { userCards, cards, stack } = randomCards(users);

    users.forEach((user) => {
      io.to(usersFromRoom[user]).emit('cards', userCards[user]);
    });

    io.emit('start_match', { users, stack, cards, turn: 0 });
  });

  socket.on('winner', (winner) => socket.broadcast.emit('winner', winner));

  socket.on('play_again', () => io.emit('new_game'));

  socket.on('disconnect', async () => {
    const roomId = (socket.nsp.name).slice(1);
    const usersFromRoom = await database.User.getFromRoom(roomId);

    const lengthUsers = Object.keys(JSON.parse(JSON.stringify(usersFromRoom))).length;

    if (!lengthUsers) return;
    if (lengthUsers === 1) {
      await database.Room.remove(roomId);
      await database.User.removeOwner(roomId);
      await database.User.remove({ roomId, username: Object.keys(usersFromRoom)[0] });

      return;
    }

    let users = Object.keys(usersFromRoom);
    const [userToRemove] = users.filter((username) => usersFromRoom[username] === socket.id);
    await database.User.remove({ roomId, username: userToRemove });

    users = users.filter((username) => usersFromRoom[username] !== socket.id);
    io.emit('user_disconnected', users);
  });
}
