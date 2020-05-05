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
      show: true
    }
    this.handleStart = this.handleStart.bind(this)
    this.handleSave = this.handleSave.bind(this)
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
      console.log(data)
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

    return (
      <Layout title="Game">
        <div style={{ textAlign: 'center' }}>
          <p>Game: {this.state.roomId}</p>
          <p>Conectados:</p>
          {renderUsers}
          <button onClick={this.handleStart}>Comenzar</button>
        </div>
      </Layout>
    )
  }
}

export default Game