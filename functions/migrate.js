require('dotenv').config()
const bcrypt = require('bcrypt')
const { User } = require('../services/mongo')
const { sign } = require('../services/jwt')

exports.handler = async ({ queryStringParameters: { api_key: apiKey, username, password } }) => {
  try {
    if (!apiKey) {
      throw new Error('Missing api key')
    }

    if (apiKey !== process.env.API_KEY) {
      throw new Error('Api key is invalid')
    }

    if (!username || !password) {
      throw new Error('Missing required parameters')
    }

    let user = await User.findOne({ username }).exec()
    if (user) {
      throw new Error('User already exists')
    }

    user = await User.create({
      username,
      password: bcrypt.hashSync(password, 10),
    })

    sign({
      username: user.username,
      password: user.password,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success',
      }),
    }
  } catch ({ message }) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
    }
  }
}
