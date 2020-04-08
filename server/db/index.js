const { modelUrl } = require('./setup')
const bcrypt = require('bcrypt')

let api = null
async function setup () {
  if (!api) {
    api = await modelUrl()
  }
}

module.exports = {
  async createUser ({ username, password }) {
    try {
      await setup()
      const pass = await bcrypt.hash(password, 10)
      const user = api.User.create({ username, password: pass })

      return user
    } catch (err) {
      return { error: err }
    }
  },
  async loginUser ({ username, password }) {
    try {
      await setup()
      const user = await api.User.findOne({ where: { username } })
      if (!user || !user.username) return { error: 'user not found' }

      const compare = await bcrypt.compare(password, user.password)
      return { compare, userId: user.id }
    } catch (err) {
      return { error: err }
    }
  }
}