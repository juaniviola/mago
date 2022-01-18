import { createClient } from 'redis';
import sequelize from './setup';
import { Room } from './models';
import { UserApi, RoomApi } from './api';

class Database {
  constructor() {
    this.User = null;
    this.Room = null;
  }

  async connect({ force = false, redisUrl = null } = {}) {
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

      this.User = api.User;
      this.Room = api.Room;

      return api;
    } catch (error) {
      throw Error(error);
    }
  }
}

export default new Database();
