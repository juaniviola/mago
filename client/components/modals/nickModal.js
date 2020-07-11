import { Component } from 'react'
import { Modal, Button, Form } from "react-bootstrap"

export default class nickModal extends Component {
  render () {
    if (!this.props.userModal) return null
    return (
      <Modal show={this.props.userModal} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Bienvenido!</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicNick">
              <Form.Label>Nickname</Form.Label>
              <Form.Control type="text" placeholder="Ingrese un nickname" onChange={(el) => this.props.changevalue(el.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.props.handlesave}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}