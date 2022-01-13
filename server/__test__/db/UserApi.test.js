import 'core-js/stable';
import 'regenerator-runtime/runtime';
import database from '../../db';

describe('Room Api methods', () => {
  let User;
  let fooUser = null, testUser = null;

  beforeAll(async () => {
    const db = await database({ force: true });
    User = db.User;
  });

  it('create -> should create new row', async () => {
    const username = 'test';
    const newUser = await User.create({ username });
    testUser = { id: newUser.id, username, roomId: 1, socketId: 1 };

    expect(newUser).toBeTruthy();
    expect(newUser.username).toEqual(username);
  });

  it('addToRoom -> should update roomId column', async () => {
    const { roomId, username, socketId } = testUser;
    const add = await User.addToRoom({ username, roomId, socketId });

    expect(add).toBeTruthy();
    expect(JSON.stringify(add)).toEqual('[1]');
  });

  it('getFromRoom -> it should return 2 users from room 1', async () => {
    const foo = await User.create({ username: 'foo' });
    fooUser = { username: 'foo', id: foo.id, roomId: 1, socketId: 2 };

    await User.addToRoom({ username: 'foo', roomId: 1, socketId: 2 });

    const roomUsers = await User.getFromRoom(1);

    expect(roomUsers).toBeTruthy();
    expect(roomUsers.length).toBe(2);
  });

  it('remove -> should delete one user', async () => {
    await User.remove('foo');

    const roomUsers = await User.getFromRoom(1);

    expect(roomUsers).toBeTruthy();
    expect(roomUsers.length).toBe(1);
  });

  it('getSocket -> should return socketId of user by username', async () => {
    const { username, roomId } = fooUser;
    const fooSocket = await User.getSocket({ roomId, username });

    expect(fooSocket).toBeTruthy();
    expect(fooSocket).toBe(`${2}`);
  });

  it('getRoomSockets -> should return 2 sockets in room 1', async () => {
    const { username, roomId, socketId } = fooUser;
    const usernameTest = testUser.username, socketIdTest = testUser.socketId;

    const sockets = await User.getRoomSockets(roomId);

    expect(sockets).toBeTruthy();
    expect(sockets[username]).toBe(`${socketId}`);
    expect(sockets[usernameTest]).toBe(`${socketIdTest}`);
  });

  it('removeSocket -> should delete from hash user by username', async () => {
    const { username, roomId } = fooUser;
    await User.removeSocket({ username, roomId });

    const sockets = await User.getRoomSockets(roomId);

    expect(sockets).toBeTruthy();
    expect(sockets[username]).toBeFalsy();
  });
});
