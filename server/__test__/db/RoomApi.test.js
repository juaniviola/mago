import 'core-js/stable';
import 'regenerator-runtime/runtime';
import database from '../../db';

describe('Room Api methods', () => {
  let Room = null;

  beforeAll(async () => {
    const db = await database.connect({ force: true });
    Room = db.Room;
  });

  it('create -> should create new row', async () => {
    const password = 'foo';
    const newRoom = await Room.create({ password });

    expect(newRoom).toBeTruthy();
    expect(newRoom.password).toBe(password);
    expect(newRoom.started).toBe(false);
  });

  it('get -> should return one room with id 1', async () => {
    const id = 1;
    const room = await Room.get(id);

    expect(room).toBeTruthy();
    expect(room.id).toBe(id);
    expect(room.password).toBe('foo');
    expect(room.started).toBe(false);
  });

  it('updateStatus -> should update started field to true', async () => {
    const id = 1;
    await Room.updateStatus({ roomId: id, started: true });
    const room = await Room.get(id);

    expect(room.started).toBe(true);
  });

  it('areCredentialsValid -> should return true with valid credentials', async () => {
    const areValid = await Room.areCredentialsValid({ roomId: 1, password: 'foo' });

    expect(areValid).toBeTruthy();
  });

  it('areCredentialsValid -> should throw error with invalid credentials', async () => {
    let error = null;

    try {
      await Room.areCredentialsValid({ roomId: 1, password: 'foo1' });
    } catch (err) {
      error = err.message;
    }

    expect(error).toEqual('Error: Invalid credentials');
  });

  it('getAll -> should return 1 rooms (only 1 room public)', async () => {
    await Room.create();

    const rooms = await Room.getAll();

    expect(rooms).toBeTruthy();
    expect(rooms.length).toBe(1);
  });

  it('remove -> should delete 1 room', async () => {
    await Room.remove(2);

    const rooms = await Room.getAll();

    expect(rooms.length).toBe(0);
  });
});
