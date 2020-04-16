import { useRouter } from 'next/router'
import Layout from '../../components/layout'

const Game = () => {
  const router = useRouter()
  const { gid } = router.query

  return (
    <Layout title="Game">
      <p>Game: {gid}</p>
    </Layout>
  )
}

export default Game