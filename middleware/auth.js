const { verify } = require('../services/jwt')

module.exports = async (headers) => {
  const token = headers['x-access-token']
  if (!token) {
    throw new Error('Missing auth token')
  }

  const isVerified = await verify(token)
  return isVerified
}
