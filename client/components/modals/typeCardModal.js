import { Component } from 'react'
import { Modal, Button } from "react-bootstrap"

export default class typeCardModal extends Component {
  render () {
    if (!this.props.type) return null
    const types = ['warning', 'success', 'primary', 'danger']
    const card = ['oro', 'basto', 'espada', 'copa']
    const text = ['Oro', 'Basto', 'Espada', 'Copa']

    const buttons = card.map((el, i) => {
      return (
        <Button
          key={el}
          variant={types[i]}
          style={{ marginRight: 10 }}
          onClick={() => this.props.handlechange(card[i])}>
          {text[i]}
        </Button>
      )
    })

    return (
      <Modal show={this.props.type} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Selecciona el tipo de carta</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {buttons}
        </Modal.Body>
      </Modal>
    )
  }
}