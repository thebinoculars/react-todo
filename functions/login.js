require('dotenv').config()

const bcrypt = require('bcrypt')
const { sign } = require('../services/jwt')
const { User } = require('../services/mongo')


exports.handler = async ({ body }) => {
  try {
    const { username, password } = JSON.parse(body)
    if (!username || !password) {
      throw new Error('Missing username/password')
    }

    const user = await User.findOne({ username }).exec()
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Username/Password not match')
    }

    const token = sign({ username: user.username, password: user.password })

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    }
  } catch ({ message }) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
    }
  }
}
