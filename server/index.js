import express from 'express';
import http from 'http';
import cors from 'cors';

import setupDb from './db';

import RoomRoute from './routes';

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

const connectDatabase = async () => {
  try {
    const api = await setupDb({ force: true });
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
