import { Sequelize } from 'sequelize';
import path from 'path';

const dirname = path.join(path.resolve(), './db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dirname, 'db.sqlite'),
  logging: false,
});

export default sequelize;
