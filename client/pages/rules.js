import { Container, ListGroup } from 'react-bootstrap'
import Layout from '../components/layout'

export default function Rules () {
  return (
    <Layout>
      <h1 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '15px' }}>Reglas 🃏 Mago</h1>

      <Container>
        <div>
          <ListGroup style={{ marginBottom: '20px' }}>
            <ListGroup.Item action href="#basicas">
              Basicas
            </ListGroup.Item>
            <ListGroup.Item action href="#comienzo">
              Comienzo
            </ListGroup.Item>
            <ListGroup.Item action href="#cartas">
              Tipos de cartas
            </ListGroup.Item>
            <ListGroup.Item action href="#final">
              Final
            </ListGroup.Item>
          </ListGroup>
        </div>

        <div>
          <h3 id="basicas">Basicas</h3>
          <p>Este es un juego de cartas, que se juega con baraja española.
          Se conoce "Mao" o "Mago". Y la baraja es de cuarenta cartas
          por lo que estas se saltean los ochos y nueves de dicha baraja</p>
        </div>

        <div>
          <h3 id="comienzo">Comienzo</h3>
          <p>El juego es de dos a cuatro jugadores, donde a cada jugador
          le van cinco cartas. Comienza el juego repartiendo a cada uno las cartas,
          y el primero en tirar es el más cercano al repartidor, siguiendo
          las agujas del reloj.</p>
        </div>

        <div>
          <h3 id="cartas">Cartas comunes y especiales</h3>
          <p>El juego consta de ir tirando al mazo cartas que sean del mismo palo o número
          que la anterior tirada, siempre que sea una carta común. Que son las cartas
          comprendidas del uno al tres y del cinco al seis. Los cuatros, sietes, diez, once y doces,
          son cartas especiales.
          Estas cartas son especiales porque generan un efecto al tirarlas</p>
          <p>El cuatro y once cancelan el turno del siguiente participante. Con el siete el siguiente jugador
          debera coger una carta del mazo y el doce lo mismo pero con dos.
          Aclaración: Las cartas especiales son acumulativas, hasta que nadie más tenga para tirar una carta
          especial, y ahí debera coger la suma de todo lo tirado anteriormente.</p>
        </div>

        <div>
          <h3 id="final">Final</h3>
          <p>Si el jugador posee cartas y no tiene opción de tirar al mazo, tiene que coger una. De lo contrario
          sigue tirando y gana la partida aquel que primero quede sin cartas en su mano.</p>
        </div>
      </Container>
    </Layout>
  )
}