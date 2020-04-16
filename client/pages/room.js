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
      username: '',
      room: '',
      password: '',
      visible: false,
      variant: 'danger',
      message: 'Ha ocurrido un error',
      visible2: false,
      variant2: 'danger',
      message2: 'Ha ocurrido un error'
    }
    this.handleCreateRoom = this.handleCreateRoom.bind(this)
    this.handleLoginRoom = this.handleLoginRoom.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleError () {
    this.setState({
      visible: true,
      message: 'Ha ocurrido un error',
      variant: 'danger'
    })
  }

  async handleLoginRoom (event) {
    try {
      event.preventDefault()

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          roomId: this.state.room
        })
      }

      const res = await fetch(`${config.server}/login`, options)
      const data = await res.json()

      if (data.error) return this.handleError()

      localStorage.setItem('username', this.state.username)
      localStorage.setItem('roomId', this.state.room)
      Router.push(`/game/${this.state.room}`)
    } catch (err) {
      this.handleError()
    }
  }

  async handleCreateRoom (event) {
    try {
      event.preventDefault()

      const options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      }

      const res = await fetch(`${config.server}/create`, options)
      const data = await res.json()

      if (data.error) return this.handleError()

      localStorage.setItem('username', this.state.username)
      localStorage.setItem('roomId', data.roomId)
      Router.push(`/game/${data.roomId}`)
    } catch (err) {
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
                    <Form.Group controlId="formBasicUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="username"
                        placeholder="Ingresar username"
                        onChange={(el) => this.setState({ username: el.target.value }) }
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicRoom">
                      <Form.Label>Codigo de la mesa</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese la mesa"
                        onChange={(el) => this.setState({ room: el.target.value }) }
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicPass">
                      <Form.Label>Contrasenia</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Ingrese la clave"
                        onChange={(el) => this.setState({ password: el.target.value }) }
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={this.handleLoginRoom}>Entrar</Button>
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
                    <Form.Group controlId="formBasicUsername2">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="username"
                        placeholder="Ingresar username"
                        onChange={ (el) => this.setState({ username: el.target.value }) }
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicPasswordRepeatSignup">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        onChange={(el) => this.setState({ password: el.target.value }) }
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={this.handleCreateRoom}>Crear</Button>
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
