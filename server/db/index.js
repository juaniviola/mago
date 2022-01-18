import { createClient } from 'redis';
import sequelize from './setup';
import { Room } from './models';
import { UserApi, RoomApi } from './api';

export default async ({ force = false, redisUrl = null } = {}) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force });

    const redisClient = redisUrl ? createClient({ url: redisUrl }) : createClient();
    redisClient.on('error', (err) => console.log('redis conn error:', err));

    await redisClient.connect();

    const api = {
      User: UserApi(redisClient),
      Room: RoomApi(Room),
    };

    return api;
  } catch (error) {
    throw Error(error);
  }
};
