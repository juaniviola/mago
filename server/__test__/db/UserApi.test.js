import 'core-js/stable';
import 'regenerator-runtime/runtime';
import database from '../../db';

describe('simple User Api methods', () => {
  let User;
  let fooUser = null;

  beforeAll(async () => {
    const db = await database.connect({ force: true });
    User = db.User;
  });

  it('set -> should insert new user', async () => {
    const username = 'test';
    await User.set({ roomId: 1, username, socketId: '1' });
    fooUser = { roomId: 1, username, socketId: 1 };

    const getUserInserted = await User.get({ roomId: 1, username });

    expect(getUserInserted).toBeTruthy();
    expect(getUserInserted).toEqual('1');
  });

  it('get -> should return socketId of user by username', async () => {
    const { username, roomId } = fooUser;
    const fooSocket = await User.get({ roomId, username });

    expect(fooSocket).toBeTruthy();
    expect(fooSocket).toBe(`${1}`);
  });

  it('getFromRoom -> should return 2 sockets in room 1', async () => {
    const { username, roomId, socketId } = fooUser;

    const sockets = await User.getFromRoom(roomId);

    expect(sockets).toBeTruthy();
    expect(sockets[username]).toBe(`${socketId}`);
  });

  it('remove -> should delete from hash user by username', async () => {
    const { username, roomId } = fooUser;
    await User.remove({ username, roomId });

    const sockets = await User.getFromRoom(roomId);

    expect(sockets).toBeTruthy();
    expect(sockets[username]).toBeFalsy();
  });

  describe('owner User api methods', () => {
    let foo = null;

    it('setOwner -> set owner of room', async () => {
      foo = { roomId: 1, username: 'fooo' };
      await User.setOwner(foo);

      const owner = await User.getOwner(foo.roomId);

      expect(owner).toBeTruthy();
      expect(owner).toEqual(foo.username);
    });

    it('getOwner -> get owner of room', async () => {
      const owner = await User.getOwner(foo.roomId);

      expect(owner).toBeTruthy();
      expect(owner).toEqual(foo.username);
    });

    it('removeOwner -> delete roomId with username', async () => {
      await User.removeOwner(foo.roomId);

      const owner = await User.getOwner(foo.roomId);

      expect(owner).toBeFalsy();
    });
  });
});
