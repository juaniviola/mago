import { Sequelize, Model } from 'sequelize';
import sequelize from '../setup';

class User extends Model {}

User.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  roomId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'users',
});

export default User;
