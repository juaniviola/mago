'use strict'

const redis = require('redis')
const shortid = require('shortid')
const { promisify } = require('util')

const client = redis.createClient()
client.on('error', error => console.error(error))
client.on('connect', () => {
  console.log('connected')
})

// methods
const hmset = promisify(client.hmset).bind(client)
const hgetall = promisify(client.hgetall).bind(client)
const rpush = promisify(client.rpush).bind(client)
const lrange = promisify(client.lrange).bind(client)
const ltrim = promisify(client.ltrim).bind(client)

module.exports = {
  async createRoom ({ username, password }) {
    try {
      const roomId = shortid.generate()
      await hmset(roomId, ['id', roomId, 'password', password])
      await rpush(`users_${roomId}`, username)

      const _users = await lrange(`users_${roomId}`, 0, -1) // temporal

      return { roomId, users: _users }
    } catch (error) {
      return { error }
    }
  },

  async loginRoom ({ username, roomId, password }) {
    try {
      const room = await hgetall(roomId)
      if (!room || !room.password || room.password !== password) {
        return { error: 'Invalid' }
      }

      const users = await lrange(`users_${roomId}`, 0, -1)
      if (!users || !users.length || users.length === 4) {
        return { error: 'No puedes entrar' }
      }

      if (users.indexOf(username) !== -1) {
        return { error: 'Usuario existe' }
      }

      await rpush(`users_${roomId}`, username)

      const _users = await lrange(`users_${roomId}`, 0, -1) // temporal
      return { users: _users }
    } catch (error) {
      return { error }
    }
  },

  async deleteUser ({ username, roomId }) {
    try {
      const users = await lrange(`users_${roomId}`, 0, -1)
      if (!users || !users.length) {
        return { error: 'Error ocurrido' }
      }

      if (users.indexOf(username) === -1) {
        return { error: 'Usuario no existe' }
      }

      await ltrim(`users_${roomId}`, users.indexOf(username), -1)
    } catch (error) {
      return { error }
    }
  }
}
