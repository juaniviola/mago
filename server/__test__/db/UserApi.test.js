import 'core-js/stable';
import 'regenerator-runtime/runtime';
import database from '../../db';

describe('Room Api methods', () => {
  let User, Room = null;

  beforeAll(async () => {
    const db = await database({ force: true });
    User = db.User;
    Room = db.Room;
  });

  it('createUser -> should create new row', async () => {
    const username = 'test';
    const newUser = await User.createUser({ username });

    expect(newUser).toBeTruthy();
    expect(newUser.username).toEqual(username);
  });

  it('addUserToRoom -> should update roomId column', async () => {
    const roomId = 1, username = 'test';
    const add = await User.addUserToRoom({ username, roomId });

    expect(add).toBeTruthy();
    expect(JSON.stringify(add)).toEqual('[1]');
  });

  it('getUsersFromRoom -> it should return 2 users from room 1', async () => {
    await User.createUser({ username: 'foo' });
    await User.addUserToRoom({ username: 'foo', roomId: 1 });

    const roomUsers = await User.getUsersFromRoom(1);

    expect(roomUsers).toBeTruthy();
    expect(roomUsers.length).toBe(2);
  });

  it('deleteUser -> should delete one user', async () => {
    await User.deleteUser('foo');

    const roomUsers = await User.getUsersFromRoom(1);

    expect(roomUsers).toBeTruthy();
    expect(roomUsers.length).toBe(1);
  });
});
