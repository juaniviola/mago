import { createClient } from 'redis';
import sequelize from './setup';
import { User, Room } from './models';
import { UserApi, RoomApi } from './api';

export default async ({ force = false } = {}) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force });

    // TODO: add connection url
    const redisClient = createClient();
    redisClient.on('error', (err) => console.log('error connection', err));

    await redisClient.connect();

    const api = {
      User: UserApi(User, redisClient),
      Room: RoomApi(Room),
    };

    return api;
  } catch (error) {
    throw Error(error);
  }
};
