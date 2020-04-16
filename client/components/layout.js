import Link from 'next/link'
import Head from 'next/head'
import { Navbar } from 'react-bootstrap'

export default ({ children, title = 'Mago game card!' }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <Navbar bg="dark">
        <Link href="/">
          <Navbar.Brand style={{ color: 'white', cursor: 'pointer' }} >Mago</Navbar.Brand>
        </Link>
      </Navbar>
    </header>

    {children}

  </div>
)