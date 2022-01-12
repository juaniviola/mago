import sequelize from './setup';
import { User, Room } from './models';
import { UserApi, RoomApi } from './api';

export default async ({ force = false } = {}) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force });

    const api = {
      User: UserApi(User),
      Room: RoomApi(Room),
    };

    return api;
  } catch (error) {
    throw Error(error);
  }
};
