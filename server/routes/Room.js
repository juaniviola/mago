import express from 'express';
import socketLogic from '../socket';

const app = express.Router();

app.get('/all', async (req, res) => {
  const roomApi = req.app.get('roomApi');

  try {
    const rooms = await roomApi.getAll();

    return res.json(rooms);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get('/id/:id/:username', async (req, res) => {
  const { id, username } = req.params;
  const roomApi = req.app.get('roomApi');
  const userApi = req.app.get('userApi');

  try {
    const room = await roomApi.get(id);
    if (!room || !room.id) throw Error(0);

    const roomOwner = await userApi.getOwner(id);

    return res.json({
      owner: roomOwner === username,
    });
  } catch (error) {
    res.sendStatus(404);
  }
});

app.post('/create', async (req, res) => {
  const { username, password } = req.body;
  const roomApi = req.app.get('roomApi');
  const userApi = req.app.get('userApi');
  const io = req.app.get('io');

  try {
    const newRoom = await roomApi.create({ password });
    if (!newRoom || !newRoom.dataValues || !newRoom.dataValues.id) throw Error(0);

    // set owner of room in hash 'owner'
    await userApi.set({
      roomId: 'owner',
      username: newRoom.id,
      socketId: username,
    });

    socketLogic(io.of(`/${newRoom.id}`));

    res.json({ id: newRoom.id });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/login', async (req, res) => {
  const { roomId, password } = req.body;
  const roomApi = req.app.get('roomApi');
  const userApi = req.app.get('userApi');

  try {
    const room = await roomApi.get(roomId);
    if (!room || !room.id || !!room.started) throw Error(0);

    const login = await roomApi.areCredentialsValid({ roomId, password });
    const usersInRoom = await userApi.getFromRoom(roomId);

    if (!login || Object.keys(usersInRoom || {}).length === 4) throw Error(0);

    res.json({ logged: true });
  } catch (error) {
    res.json({ logged: false });
  }
});

export default app;
