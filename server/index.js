'use strict'

// vars
const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db')

// sv config
app.use(cors())
app.use(express.json()) // Json parse

// signout route
app.post('/login', async (req, res) => {
  const { username, roomId, password } = req.body

  try {
    const login = await db.loginRoom({ username, roomId, password })
    if (!login.error) {
      return res.status(200).json({ message: 'connected', users: login.users })
    }

    res.status(500).json({ error: 'Ha ocurrido un error' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Ha ocurrido un error' })
  }
})

// signup route
app.post('/create', async (req, res) => {
  const { username, password } = req.body

  try {
    const room = await db.createRoom({ username, password })
    if (!room.error) {
      return res.status(200).json({ roomId: room.roomId, message: 'created', users: room.users })
    }

    res.status(500).json({ error: 'Ha ocurrido un error' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Ha ocurrido un error' })
  }
})

app.listen(process.env.PORT || 8001, () => console.log('running...'))
