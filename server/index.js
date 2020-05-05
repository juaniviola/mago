'use strict'

// vars
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const jwt = require('jsonwebtoken')
const db = require('./db')

// sv config
app.use(cors())
app.use(express.json()) // Json parse

// socket io
io.on('connection', socket => {
  console.log('user connected with id:', socket.id)
})

const rooms = {}
function listenRoom (room) {
  const _io = rooms[room]
  _io.on('connection', async socket => {
    socket.on('new_player', async ({ token, username }) => {
      try {
        const _token = await jwt.verify(token, 'secretinho')
        const u = await db.addUser({ username, sid: socket.id, roomId: _token.rid})
        const users = []
        for (let i in u) {
          if (i%2 === 0) users.push(u[i])
        }
        _io.emit('user_connected', JSON.stringify({ users }))
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('start_match', async () => {
      const users = await db.getUsers({ roomId: socket.nsp.name })
      for (let i in users) {
        if (i%2 !== 0) {
          _io.to(users[i]).emit('card', i)
        }
      }
    })

    socket.on('disconnect', async () => {
      try {
        const u = await db.deleteUser({ sid: socket.id, roomId: socket.nsp.name })
        const users = []
        for (let i in u) {
          if (i%2 === 0) users.push(u[i])
        }
        _io.emit('user_connected', JSON.stringify({ users }))
      } catch (error) {
        console.log(error)
      }
    })
  })
}

// signout route
app.post('/login', async (req, res) => {
  const { roomId, password } = req.body

  try {
    const login = await db.loginRoom({ roomId, password })
    if (!login.error) {
      const token = await jwt.sign({ rid: roomId }, 'secretinho')
      return res.status(200).json({
        message: 'connected',
        token
      })
    }

    res.status(500).json({ error: 'Ha ocurrido un error' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Ha ocurrido un error' })
  }
})

// signup route
app.post('/create', async (req, res) => {
  const { password } = req.body

  try {
    const room = await db.createRoom({ password })
    if (!room.error) {
      rooms[room.roomId] = io.of(`/${room.roomId}`)
      listenRoom(room.roomId)

      const token = await jwt.sign({ rid: room.roomId }, 'secretinho')
      return res.status(200).json({
        roomId: room.roomId,
        message: 'created',
        token
      })
    }

    res.status(500).json({ error: 'Ha ocurrido un error' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Ha ocurrido un error' })
  }
})

http.listen(process.env.PORT || 8001, () => console.log('running...'))
