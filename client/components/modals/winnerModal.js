import { Component } from 'react'
import { Modal } from 'react-bootstrap'

export default class winnerModal extends Component {
  render () {
    if (!this.props.show) return null
    return (
      <Modal show={this.props.show} onHide={() => this.props.close()}>
        <Modal.Header closeButton>
          <Modal.Title>Hay un ganador!</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>El juego termino, ha ganado <strong>{this.props.winner}</strong></p>
        </Modal.Body>
      </Modal>
    )
  }
}