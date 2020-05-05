import React from 'react'
import Link from 'next/link'
import Layout from '../components/layout'
import { Button } from 'react-bootstrap'

export default class Index extends React.Component {

  render () {
    return (
      <Layout title="Mago, un juego de cartas para toda la familia!">
        <div>
          <h3 style={{ marginTop: '20px', textAlign: 'center' }}>🃏 Juego del Mago 🃏 (beta)</h3>
        </div>
        <div style={{ 'marginTop': '20px' }}>
          <img style={{ margin: '0 auto', display: 'block' }} src='/cards.jpg' alt='card' width="250px" />
        </div>
        <div>
          <div style={{ 'marginTop': '20px' }}>
            <Link href="/room">
              <Button variant="primary" style={{ margin: '0 auto', display: 'block' }}>Jugar!</Button>
            </Link>
          </div>

          <div style={{ 'marginTop': '15px' }}>
            <Link href="/rules">
              <Button variant="primary" style={{ margin: '0 auto', display: 'block' }}>Reglas</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }
}