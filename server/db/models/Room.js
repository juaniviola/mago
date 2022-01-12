import { Sequelize, Model } from 'sequelize';
import sequelize from '../setup';

class Room extends Model {}

Room.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  started: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },

  userOwner: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'rooms',
});

export default Room;
