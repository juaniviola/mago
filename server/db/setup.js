'use strict'

const Sequelize = require('sequelize')
const path = require('path')

// dialect
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite'),
  logging: false
})

// model
const Model = Sequelize.Model
class User extends Model {}

User.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user'
})

// setup fn
async function modelUrl() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    return { User }
  } catch (err) { return { error: err } }
}

module.exports = { modelUrl }