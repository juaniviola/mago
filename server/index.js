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

function randomCards (users)  {
  const cards = [
    '1_oro', '2_oro', '3_oro', '4_oro', '5_oro', '6_oro', '7_oro', '10_oro', '11_oro', '12_oro',
    '1_espada', '2_espada', '3_espada', '4_espada', '5_espada', '6_espada', '7_espada', '10_espada', '11_espada', '12_espada',
    '1_basto', '2_basto', '3_basto', '4_basto', '5_basto', '6_basto', '7_basto', '10_basto', '11_basto', '12_basto',
    '1_copa', '2_copa', '3_copa', '4_copa', '5_copa', '6_copa', '7_copa', '10_copa', '11_copa', '12_copa'
  ]

  const userCards = {}
  for (let i in users) {
    for (let j = 0; j < 5; j++) {
      const x = Math.floor((Math.random() * (cards.length)))
      if (j !== 0)
        userCards[users[i]].push(cards[x])
      else
        userCards[users[i]] = [cards[x]]
      cards.splice(x, 1)
    }
  }

  const x = Math.floor((Math.random() * (cards.length)))
  const stack = [ cards[x] ]
  cards.splice(x, 1)

  return { userCards, cards, stack }
}

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
      const _users = []
      const _ids = []
      for (let i in users) {
        if (i%2 !== 0) {
          _ids.push(users[i])
        } else {
          _users.push(users[i])
        }
      }

      const rand = randomCards(_users)
      for (let i in _ids) {
        _io.to(_ids[i]).emit('card', { cards: rand.userCards[_users[i]], turn: 0 })
      }
      _io.emit('mazo', { mazo: rand.cards, stack: rand.stack })
    })

    socket.on('play_card', ({ card, turn }) => socket.broadcast.emit('card_played', { card, turn }))
    socket.on('take_card', i => socket.broadcast.emit('card_taked', i))

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
