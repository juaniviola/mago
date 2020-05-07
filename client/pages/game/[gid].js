import React from 'react'
import io from 'socket.io-client'
import Layout from '../../components/layout'
import config from '../../config'

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      roomId: null,
      username: null,
      socket: null,
      users: [],
      show: true,
      gameStarted: false,
      myTurn: false,
      cards: [],
      mazo: [],
      stack: ['-']
    }
    this.handleStart = this.handleStart.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePlayCard = this.handlePlayCard.bind(this)
    this.handleTakeCard = this.handleTakeCard.bind(this)
  }

  async componentDidMount () {
    const roomId = await localStorage.getItem('roomId')
    const socket = io(`${config.server}/${roomId}`)

    this.setState({
      roomId,
      socket,
    })

    socket.on('user_connected', users => {
      this.setState({ users: JSON.parse(users).users })
    })

    socket.on('card', data => {
      this.setState({ cards: data.cards })
      if (this.state.users[data.turn] === this.state.username) {
        this.setState({ myTurn: true })
      }
    })

    socket.on('mazo', data => {
      this.setState({ mazo: data.mazo, stack: data.stack, gameStarted: true })
    })

    socket.on('card_played', ({ card, turn }) => {
      const stack = this.state.stack
      stack.unshift(card)
      this.setState({ stack })
      if (this.state.users[turn] === this.state.username) {
        this.setState({ myTurn: true })
      }
    })

    socket.on('card_taked', i => {
      const mazo = this.state.mazo
      mazo.splice(0, 1)
      this.setState({ mazo })
      if (this.state.users[i] === this.state.username) {
        this.setState({ myTurn: true })
      }
    })

    let user = ''
    while (user === '' || !user) {
      user = prompt('Nombre de usuario')
    }
    this.setState({ username: user })
    this.handleSave()
  }

  handleStart () {
    const socket = this.state.socket
    socket.emit('start_match')
  }

  handlePlayCard (card) {
    const c1 = card.slice(card.indexOf('_')+1, card.length)
    const c2 = this.state.stack[0].slice(this.state.stack[0].indexOf('_')+1, this.state.stack[0].length)
    const n1 = card.slice(0, card.indexOf('_'))
    const n2 = this.state.stack[0].slice(0, this.state.stack[0].indexOf('_'))
    if (c1 !== c2 && n1 !== n2) {
      return alert('Jugada invalida!')
    }

    const socket = this.state.socket
    const cards = this.state.cards
    const stack = this.state.stack
    cards.splice(cards.indexOf(card), 1)
    stack.unshift(card)
    this.setState({ cards, stack })
    let i = this.state.users.indexOf(this.state.username)
    if (n1 === '4' || n1 === '11') {
      i=i+2
    } else {
      i++
    }
    const u = [...this.state.users, ...this.state.users]
    if (u[i] !== this.state.username) this.setState({ myTurn: false })
    socket.emit('play_card', { card, turn: this.state.users.indexOf(u[i]) })
  }

  handleTakeCard () {
    const socket = this.state.socket
    const cards = this.state.cards
    const mazo = this.state.mazo
    cards.push(mazo[0])
    mazo.splice(0, 1)
    this.setState({ cards, mazo, myTurn: false })
    let i = this.state.users.indexOf(this.state.username)
    if (i + 1 > (this.state.users.length)-1) {
      i = 0
    } else {
      i++
    }
    socket.emit('take_card', i)
  }

  async handleSave () {
    const socket = this.state.socket
    const username = this.state.username
    if (username !== '') {
      const token = await localStorage.getItem('token')
      socket.emit('new_player', { username, token})
      this.setState({ show: false })
    } else {
      alert('type username!')
    }
  }

  render () {
    const renderUsers = this.state.users.map((el, i) => {
      return <li key={i.toString()}>{el}</li>
    })

    const renderCards = this.state.cards.map((el, i) => {
      return (
        <p key={i.toString()}>{el}
          {this.state.myTurn && <button onClick={() => this.handlePlayCard(el)}>Jugar</button>}
        </p>
      )
    })

    return (
      <Layout title="Game">
        <div style={{ textAlign: 'center' }}>
          <p>Game: {this.state.roomId}</p>
          <p>Conectados:</p>
          {renderUsers}
          {this.state.myTurn && <div><button onClick={this.handleTakeCard}>Alzar</button></div>}
          stack: {this.state.stack[0]}
          <div>{renderCards}</div>
          {!this.state.gameStarted && <button onClick={this.handleStart}>Comenzar</button>}
        </div>
      </Layout>
    )
  }
}

export default Game