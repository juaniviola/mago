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
const lrange = promisify(client.lrange).bind(client)
const rpush = promisify(client.rpush).bind(client)
const delSet = promisify(client.DEL).bind(client)

module.exports = {
  async createRoom ({ password }) {
    try {
      const roomId = shortid.generate()
      await hmset(roomId, ['id', roomId, 'password', password])

      return { roomId }
    } catch (error) {
      return { error }
    }
  },

  async loginRoom ({ roomId, password }) {
    try {
      const room = await hgetall(roomId)
      if (!room || !room.password || room.password !== password) {
        return { error: 'Invalid' }
      }

      const users = await lrange(`users_${roomId}`, 0, -1)
      if (!users || !users.length || users.length > 8) {
        return { error: 'Invalid' }
      }

      return true
    } catch (error) {
      return { error }
    }
  },

  async addUser ({ username, sid, roomId }) {
    await rpush(`users_${roomId}`, username, sid)
    return lrange(`users_${roomId}`, 0, -1)
  },

  async deleteUser ({ sid, roomId }) {
    try {
      const _rid = roomId.slice(1, roomId.length)
      const users = await lrange(`users_${_rid}`, 0, -1)
      if (!users || !users.length) {
        return { error: 'Error ocurrido' }
      }

      const id = users.indexOf(sid)
      const user = users.indexOf(sid) - 1
      if (id === -1) {
        return { error: 'Usuario no existe' }
      }
      users.splice(user, 2)

      await delSet(`users_${_rid}`)
      for (let i in users) {
        await rpush(`users_${_rid}`, users[i])
      }

      return lrange(`users_${_rid}`, 0, -1)
    } catch (error) {
      return { error }
    }
  },

  getUsers ({ roomId }) {
    const rid = roomId.slice(1, roomId.length)
    return lrange(`users_${rid}`, 0, -1)
  }
}
