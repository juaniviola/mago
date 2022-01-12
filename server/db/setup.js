import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dirname, 'db.sqlite'),
  logging: true,
});

export default sequelize;
