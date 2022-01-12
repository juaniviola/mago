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

  it('createRoom -> should create new row', async () => {
    await User.createUser({ username: 'test' });

    const userOwner = 1, password = 'foo';
    const newRoom = await Room.createRoom({ userOwner, password });

    expect(newRoom).toBeTruthy();
    expect(newRoom.userOwner).toEqual(userOwner);
    expect(newRoom.password).toBe(password);
    expect(newRoom.started).toBe(false);
  });

  it('getRoom -> should return one room with id 1', async () => {
    const id = 1;
    const room = await Room.getRoom(id);

    expect(room).toBeTruthy();
    expect(room.id).toBe(id);
    expect(room.userOwner).toEqual(1);
    expect(room.password).toBe('foo');
    expect(room.started).toBe(false);
  });

  it('updateRoomStatus -> should update started field to true', async () => {
    const id = 1;
    await Room.updateRoomStatus({ roomId: id, started: true });
    const room = await Room.getRoom(id);

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

  it('getAllRooms -> should return 2 rooms', async () => {
    await User.createUser({ username: 'test2' });
    await Room.createRoom({ userOwner: 2 });

    const rooms = await Room.getAllRooms();

    expect(rooms).toBeTruthy();
    expect(rooms.length).toBe(2);
  });

  it('deleteRoom -> should delete 1 room', async () => {
    await Room.deleteRoom(2);

    const rooms = await Room.getAllRooms();

    expect(rooms.length).toBe(1);
  });
});
