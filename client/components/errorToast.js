import { Component } from 'react'
import { Toast } from 'react-bootstrap'

export default class ErrorToast extends Component {
  render () {
    if (!this.props.toast) return null
    return (
      <Toast
        onClose={this.props.onclose}
        show={this.props.toast} delay={1500} autohide
        className="toast"
      >
        <Toast.Header>
          <strong className="mr-auto error">Error!</strong>
        </Toast.Header>
        <Toast.Body>No puedes jugar esa carta!</Toast.Body>
      </Toast>
    )
  }
}