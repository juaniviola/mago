import React from 'react'
import io from 'socket.io-client'
import { Button, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Layout from '../../components/layout'
import config from '../../config'
import utils from '../../utils'

import NickModal from '../../components/modals/nickModal'
import TypeCardModal from '../../components/modals/typeCardModal'
import WinnerModal from '../../components/modals/winnerModal'
import ErrorToast from '../../components/errorToast'

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      roomId: null,
      username: '',
      userModal: false,
      socket: null,
      users: [],
      show: false,
      gameStarted: false,
      gameWinner: false,
      winnerUser: '',
      toast: false,
      type: false,
      myTurn: false,
      cards: [],
      mazo: [],
      stack: [],
      mainCard: '',
      cant: 0,
      turn: 0
    }

    this.handleStart = this.handleStart.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePlayCard = this.handlePlayCard.bind(this)
    this.handleTakeCard = this.handleTakeCard.bind(this)
    this.handleChange = this.handleChange.bind(this)
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
      this.setState({ mazo: data.mazo, stack: data.stack, gameStarted: true, cant: data.cant, mainCard: data.stack[0] })
      if (data.cant === 0) return

      if (this.state.myTurn === true) {
        const cantTake = utils.canTakeCard(this.state.mainCard, this.state.cards)
        if (!cantTake) {
          this.handleTakeCard(data.cant)
        }
      }
    })

    socket.on('card_played', ({ card, turn, cant }) => {
      const stack = this.state.stack
      stack.unshift(card)
      this.setState({ stack, cant, mainCard: card, turn })

      if (cant !== 0) {
        const cantTake = utils.canTakeCard(this.state.mainCard, this.state.cards)
        if (!cantTake && this.state.users[turn] === this.state.username) {
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
      this.setState({ mazo, myTurn: false, cant: 0, turn })
      if (this.state.users[turn] === this.state.username) {
        this.setState({ myTurn: true })
      }
    })

    socket.on('palo_changed', p => {
      this.setState({ mainCard: `10_${p}` })
    })

    socket.on('winner', payload => {
      this.setState({ gameWinner: true, winnerUser: payload, show: true })
    })

    socket.on('repartido', payload => {
      const { username, cant, stack } = payload

      this.setState({ mazo: stack, stack: [] })
      if (username === this.state.username) {
        this.handleTakeCard(cant)
      }
    })

    socket.on('clear', () => {
      this.setState({
        gameStarted: false,
        gameWinner: false,
        winnerUser: '',
        myTurn: false,
        cards: [],
        mazo: [],
        stack: [],
        mainCard: '',
        cant: 0,
        turn: 0
      })
    })

    this.setState({ userModal: true })
  }

  handleStart () {
    if (this.state.users.length <= 1) return

    const socket = this.state.socket
    socket.emit('clear_vars')
    socket.emit('start_match')
  }

  handlePlayCard (card) {
    const socket = this.state.socket
    const cards = this.state.cards
    const stack = this.state.stack
    const username = this.state.username

    let i = this.state.users.indexOf(this.state.username)
    const c1 = card.slice(card.indexOf('_')+1, card.length)
    const c2 = this.state.mainCard.slice(this.state.mainCard.indexOf('_')+1, this.state.mainCard.length)
    const n1 = card.slice(0, card.indexOf('_'))
    const n2 = this.state.mainCard.slice(0, this.state.mainCard.indexOf('_'))

    if (n1 === '10') {
      cards.splice(cards.indexOf(card), 1)
      stack.unshift(card)
      this.setState({ cards, stack, mainCard: card, type: true })
      return
    }

    if (c1 !== c2 && n1 !== n2) {
      return this.setState({ toast: true })
    }

    let cant = this.state.cant
    if (cant !== 0) {
      if (n1 === n2 || (`7_${c2}` === card || `12_${c2}` === card)) {
        cards.splice(cards.indexOf(card), 1)
        stack.unshift(card)
        this.setState({ cards, stack, mainCard: card })

        i++
        const u = [...this.state.users, ...this.state.users]
        if (u[i] !== this.state.username) this.setState({ myTurn: false })
        this.setState({ turn: this.state.users.indexOf(u[i]) })

        socket.emit('play_card', { card, turn: this.state.users.indexOf(u[i]), cant: n1 === '7' ? cant+1 : cant+2 })
        if (this.state.cards.length === 0) {
          socket.emit('winner', username)
          this.setState({ gameWinner: true, winnerUser: username, show: true })
        }
        return
      } else {
        return this.setState({ toast: true })
      }
    }

    cards.splice(cards.indexOf(card), 1)
    stack.unshift(card)
    this.setState({ cards, stack, mainCard: card })

    if (n1 === '4' || n1 === '11') {
      i=i+2
    } else {
      i++
    }
    const u = [...this.state.users, ...this.state.users]
    if (u[i] !== this.state.username) this.setState({ myTurn: false })
    this.setState({ turn: this.state.users.indexOf(u[i]) })

    if (n1 === '7') {
      cant = 1
    } else if (n1 === '12') {
      cant = 2
    } else {
      cant = 0
    }
    socket.emit('play_card', { card, turn: this.state.users.indexOf(u[i]), cant })
    if (this.state.cards.length === 0) {
      socket.emit('winner', username)
      this.setState({ gameWinner: true, winnerUser: username, show: true })
    }
  }

  handleTakeCard (cant) {
    const socket = this.state.socket
    let cards = this.state.cards
    const mazo = this.state.mazo

    if (mazo.length < cant && this.state.stack.length >= cant) {
      return socket.emit('repartir', { user: this.state.username, cant, stack: this.state.stack.slice(1, this.state.stack.length) })
    }

    const takeds = mazo.splice(0, cant)
    cards = [...cards, ...takeds]

    let i = this.state.users.indexOf(this.state.username)+1
    const u = [...this.state.users, ...this.state.users]
    const user = this.state.users.indexOf(u[i])
    if (u[i] !== this.state.username) this.setState({ myTurn: false })

    this.setState({ cards, mazo, cant: 0, turn: user })
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
      return this.setState({ userModal: true })
    }
    this.setState({ userModal: false })
  }

  async handleChange (palo) {
    const socket = this.state.socket
    const card = this.state.socket[0]
    const u = [...this.state.users, ...this.state.users]
    let i = this.state.users.indexOf(this.state.username)
    i++
    if (u[i] !== this.state.username) this.setState({ myTurn: false })
    this.setState({ turn: this.state.users.indexOf(u[i]) })
    socket.emit('play_card', { card, turn: this.state.users.indexOf(u[i]), cant: 0 })
    if (this.state.cards.length === 0) {
      socket.emit('winner', this.state.username)
      this.setState({ gameWinner: true, winnerUser: this.state.username, show: true })
    }
    this.setState({ mainCard: `10_${palo}`, type: false})
    socket.emit('change_palo', palo)
  }

  render () {
    const renderUsers = this.state.users.map((el, i) => {
      return <li key={i.toString()}>{el}</li>
    })

    const renderCards = this.state.cards.map((el, i) => {
      return (
        <p key={i.toString()}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-top`}>
                {this.state.myTurn && <strong>Jugar</strong>}
                {!this.state.myTurn && <span>Espera tu turno</span>}
              </Tooltip>
            }
          >
            <img
              className={`cardPlay ${this.state.myTurn ? 'cursorCardPlay' : ''}`}
              src={`/cards/${el}.jpg`}
              alt={el} width="115.2" height="160"
              onClick={() => this.state.myTurn ? this.handlePlayCard(el) : null}
            />
          </OverlayTrigger> <br/>
        </p>
      )
    })

    return (
      <Layout title="Game">
        <div style={{ textAlign: 'center' }}>
          {/* Muestra el id de la sala y los usuarios conectados */}
          <div style={{ marginRight: 15, marginLeft: 15}}>
            <Alert variant="dark" style={{ marginTop: 10 }}>
              Nombre de la mesa <strong>{this.state.roomId}</strong>
            </Alert>

            <Alert variant="primary">
              <strong>Usuarios conectados</strong>
              {renderUsers} <br/>
              {this.state.gameStarted && <span>Turno de <strong>{this.state.users[this.state.turn]}</strong></span>}
            </Alert>
          </div>

          {/* Carta que lanzan los jugadores */}
          {(this.state.gameStarted && !this.state.gameWinner) && <img src={`/cards/${this.state.mainCard}.jpg`} alt={this.state.mainCard} width="115.2" height="160" style={{ marginTop: 30, borderRadius: 10 }} />}

          {/* Boton para alzar carta del mazo */}
          {(this.state.myTurn && !this.state.gameWinner) && <div>
            <Button
              variant="info"
              onClick={() => this.handleTakeCard(this.state.cant === 0 ? 1 : this.state.cant)}
              style={{ marginBottom: 15 }}>Alzar</Button>
          </div>}

          {/* Muestra las cartas disponibles del usuario */}
          {(!this.state.gameWinner && this.state.gameStarted) && <div><span>Mis cartas</span></div>}
          {!this.state.gameWinner && <div className="cards">{renderCards}</div>}

          {/* Comenzar juego */}
          {(!this.state.gameStarted && !this.state.gameWinner) && <Button variant="dark" onClick={this.handleStart}>Comenzar</Button>}

          {/* Modal para el nombre de usuario */}
          <NickModal
            userModal={this.state.userModal}
            handlesave={this.handleSave}
            changevalue={(us) => this.setState({ username: us })}
          />

          {/* Modal para el ganador */}
          <WinnerModal
            show={this.state.show}
            close={() => this.setState({ show: false })}
            winner={this.state.winnerUser}
          />

          {/* Modal para el cambiar el tipo de carta */}
          <TypeCardModal type={this.state.type} handlechange={this.handleChange} />

          {/* Muestra el ganador */}
          {this.state.gameWinner && <div>
            <span style={{ marginBottom: 15 }}>El ganador del juego es {this.state.winnerUser}</span>
            <div><Button variant="dark" onClick={this.handleStart}>Jugar otro</Button></div>
          </div>}

          {/* Error toast */}
          <ErrorToast
            onclose={() => this.setState({ toast: false})}
            toast={this.state.toast}
          />
        </div>
      </Layout>
    )
  }
}

export default Game