import React from 'react'
import io from 'socket.io-client'
import Layout from '../../components/layout'
import config from '../../config'
import utils from '../../utils'

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
      stack: ['-'],
      cant: 0
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
      this.setState({ mazo: data.mazo, stack: data.stack, gameStarted: true, cant: data.cant })
      if (data.cant === 0) return

      if (this.state.myTurn === true) {
        const cantTake = utils.canTakeCard(this.state.stack[0], this.state.cards)
        if (!cantTake) {
          this.handleTakeCard(data.cant)
        }
      }
    })

    socket.on('card_played', ({ card, turn, cant }) => {
      const stack = this.state.stack
      stack.unshift(card)
      this.setState({ stack, cant })

      if (cant !== 0) {
        const cantTake = utils.canTakeCard(this.state.stack[0], this.state.cards)
        if (!cantTake) {
          this.handleTakeCard(cant)
          return
        }
      }

      if (this.state.users[turn] === this.state.username) {
        this.setState({ myTurn: true })
      }
    })

    socket.on('card_taked', ({ turn, cant }) => {
      const mazo = this.state.mazo
      mazo.splice(0, cant)
      this.setState({ mazo, myTurn: false, cant: 0 })
      if (this.state.users[turn] === this.state.username) {
        this.setState({ myTurn: true })
      }
    })

    socket.on('palo_changed', p => {
      const stack = this.state.stack
      stack[0] = `10_${p}`
      this.setState({ stack })
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
    const socket = this.state.socket
    const cards = this.state.cards
    const stack = this.state.stack

    let i = this.state.users.indexOf(this.state.username)
    const c1 = card.slice(card.indexOf('_')+1, card.length)
    const c2 = this.state.stack[0].slice(this.state.stack[0].indexOf('_')+1, this.state.stack[0].length)
    const n1 = card.slice(0, card.indexOf('_'))
    const n2 = this.state.stack[0].slice(0, this.state.stack[0].indexOf('_'))
    if (c1 !== c2 && n1 !== n2) {
      return alert('Jugada invalida!')
    }

    let cant = this.state.cant
    if (cant !== 0) {
      if (n1 === n2 || (`7_${c2}` === card || `12_${c2}` === card)) {
        cards.splice(cards.indexOf(card), 1)
        stack.unshift(card)
        this.setState({ cards, stack })

        i++
        const u = [...this.state.users, ...this.state.users]
        if (u[i] !== this.state.username) this.setState({ myTurn: false })
        socket.emit('play_card', { card, turn: this.state.users.indexOf(u[i]), cant: n1 === '7' ? cant+1 : cant+2 })
        return
      } else {
        return alert('Jugada invalida!')
      }
    }

    cards.splice(cards.indexOf(card), 1)
    stack.unshift(card)
    this.setState({ cards, stack })

    if (n1 === '10') {
      const palo = ['espada', 'oro', 'basto', 'copa']
      const p = prompt('selecciona palo del 0 al 3')
      const u = [...this.state.users, ...this.state.users]
      i++
      if (u[i] !== this.state.username) this.setState({ myTurn: false })
      socket.emit('play_card', { card, turn: this.state.users.indexOf(u[i]), cant: 0 })
      stack[0] = `10_${palo[parseInt(p)]}`
      socket.emit('change_palo', palo[parseInt(p)])
      return
    }

    if (n1 === '4' || n1 === '11') {
      i=i+2
    } else {
      i++
    }
    const u = [...this.state.users, ...this.state.users]
    if (u[i] !== this.state.username) this.setState({ myTurn: false })

    if (n1 === '7') {
      cant = 1
    } else if (n1 === '12') {
      cant = 2
    } else {
      cant = 0
    }
    socket.emit('play_card', { card, turn: this.state.users.indexOf(u[i]), cant })
  }

  handleTakeCard (cant) {
    const socket = this.state.socket
    let cards = this.state.cards
    const mazo = this.state.mazo
    const takeds = mazo.splice(0, cant)
    cards = [...cards, ...takeds]

    let i = this.state.users.indexOf(this.state.username)+1
    const u = [...this.state.users, ...this.state.users]
    const user = this.state.users.indexOf(u[i])
    if (u[i] !== this.state.username) this.setState({ myTurn: false })

    this.setState({ cards, mazo, cant: 0 })
    socket.emit('take_card', { turn: user, cant })
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
        <p key={i.toString()}>
          <img src={`/cards/${el}.jpg`} alt={el} width="144" height="200" /> <br/>
          {this.state.myTurn && <button onClick={() => this.handlePlayCard(el)}>Jugar</button>}
        </p>
      )
    })

    return (
      <Layout title="Game">
        <div style={{ textAlign: 'center' }}>
          <p>Game id {this.state.roomId}</p>
          <p>Usuarios conectados</p>
          {renderUsers}
          {this.state.myTurn && <div><button onClick={() => this.handleTakeCard(this.state.cant === 0 ? 1 : this.state.cant)}>Alzar</button></div>}
          {this.state.gameStarted && <img src={`/cards/${this.state.stack[0]}.jpg`} alt={this.state.stack[0]} width="144" height="200" />}

          <div>
            <span>My cards</span>
          </div>

          <div className="cards">{renderCards}</div>
          {!this.state.gameStarted && <button onClick={this.handleStart}>Comenzar</button>}
        </div>
      </Layout>
    )
  }
}

export default Game