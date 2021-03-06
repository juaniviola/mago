import React from 'react'
import Router from 'next/router'
import fetch from 'node-fetch'
import Layout from '../components/layout'
import config from '../config/index'
import { Form, Accordion, Card, Button, Alert } from 'react-bootstrap'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      room: '',
      password: '',
      visible: false,
      variant: 'danger',
      message: 'Ha ocurrido un error',
      visible2: false,
      variant2: 'danger',
      message2: 'Ha ocurrido un error',
      isLoading: false
    }
    this.handleCreateRoom = this.handleCreateRoom.bind(this)
    this.handleLoginRoom = this.handleLoginRoom.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleError (message = 'Ha ocurrido un error') {
    this.setState({
      visible: true,
      message,
      variant: 'danger'
    })
  }

  async handleLoginRoom (event) {
    try {
      event.preventDefault()

      if (this.state.password === '') {
        return this.handleError('Escribe una contrasenia')
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: this.state.password,
          roomId: this.state.room
        }),
        mode: 'cors'
      }

      this.setState({ isLoading: true })
      const res = await fetch(`${config.server}/login`, options)
      const data = await res.json()
      this.setState({ isLoading: false })

      if (data.error) return this.handleError()

      localStorage.setItem('roomId', this.state.room)
      localStorage.setItem('token', data.token)
      Router.push(`/game/${this.state.room}`)
    } catch (err) {
      this.setState({ isLoading: false })
      this.handleError()
    }
  }

  async handleCreateRoom (event) {
    try {
      event.preventDefault()

      if (this.state.password === '') {
        return this.handleError('Escribe una contrasenia')
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: this.state.password
        }),
        mode: 'no-cors'
      }

      this.setState({ isLoading: true })
      const res = await fetch(`${config.server}/create`, options)
      const data = await res.json()
      this.setState({ isLoading: false })

      if (data.error) return this.handleError()

      localStorage.setItem('roomId', data.roomId)
      localStorage.setItem('token', data.token)
      Router.push(`/game/${data.roomId}`)
    } catch (err) {
      this.setState({ isLoading: false })
      this.handleError()
    }
  }

  render () {
    return (
      <Layout title="Entra y juega al mago!">
        <div>
          <h3 style={{ marginTop: '20px', textAlign: 'center' }}>Crea una sala o entra a una!</h3>
          <Accordion style={{ marginTop: '20px', marginRight: '15px', marginLeft: '15px' }} defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  Entrar a una sala
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Form>
                    {this.state.visible ? <Alert variant={this.state.variant}>{this.state.message}</Alert> : null}

                    <Form.Group controlId="formBasicRoom">
                      <Form.Label>Codigo de la mesa</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese la mesa"
                        onChange={(el) => this.setState({ room: el.target.value }) }
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicPass">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Ingrese la clave"
                        onChange={(el) => this.setState({ password: el.target.value }) }
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      onClick={this.handleLoginRoom}
                      disabled={this.state.isLoading}>{this.state.isLoading ? 'Cargando...' : 'Entrar'}</Button>
                  </Form>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                  Crear mesa
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Form>
                    {this.state.visible2 ? <Alert variant={this.state.variant2}>{this.state.message2}</Alert> : null}

                    <Form.Group controlId="formBasicPasswordRepeatSignup">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        onChange={(el) => this.setState({ password: el.target.value }) }
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      onClick={this.handleCreateRoom}
                      disabled={this.state.isLoading}>{this.state.isLoading ? 'Cargando...' : 'Crear'}</Button>
                  </Form>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </Layout>
    )
  }
}
