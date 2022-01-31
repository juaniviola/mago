import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import database from './db';

import RoomRoute from './routes';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.set('io', io);

const connectDatabase = async () => {
  try {
    const api = await database.connect();
    const { User, Room } = api;

    app.set('userApi', User);
    app.set('roomApi', Room);

    console.log('connected');
  } catch (error) {
    console.error(error);
    app.set('userApi', null);
    app.set('roomApi', null);
  }
};

app.use('/room', RoomRoute);

httpServer.listen(process.env.PORT || 8001, async () => {
  await connectDatabase();
  console.log('running...');
});
