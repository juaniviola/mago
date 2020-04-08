'use strict'

// vars
const express = require('express')
const app = express()
const session = require('cookie-session')
const passport = require('passport')
const cors = require('cors')
const db = require('./db')

const localStrategy = require('passport-local').Strategy

const sessionOptions = { keys: [ process.env.KEY_SESSION ] }

// sv config
app.use(cors())
app.use(express.json())
app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())

// passport strategy
passport.use(new localStrategy(async function (username, password, done) {
  try {
    const login = await db.loginUser({ username, password })

    if (login) {
      return done(null, { username })
    } else {
      return done('no coincide')
    }
  } catch (error) {
    return done('error ocurred')
  }
}))

passport.serializeUser((user, done) => done(null, user)) // save user in session
passport.deserializeUser((user, done) => done(null, user)) // delete user in session

// error route
app.get('/error', (_, res) => res.status(500).json({ message: 'Invalid credentials', error: true }))

// signin route
app.post('/signin', passport.authenticate('local', { failureRedirect: '/error' }), (req, res) => {
  res.status(200).json({ message: 'logged', error: false, username: req.user.username })
})

// signout route
app.get('/signout', (req, res) => {
  req.logout()
  res.status(200).json({ message: 'logout', error: false })
})

// signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await db.createUser({ username, password })
    if (user && user.username) {
      res.status(201).json({ message: 'created', error: false })
    } else {
      res.status(500).json({ message: 'Error ocurred', error: true })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error ocurred', error: true })
  }
})