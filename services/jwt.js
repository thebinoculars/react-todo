require('dotenv').config()
const jwt = require('jsonwebtoken')

const verify = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.SECRET_KEY, (err) => {
    if (err) {
      reject(err)
    }
    resolve()
  })
})

const sign = (data) => jwt.sign(
  data,
  process.env.SECRET_KEY,
  { expiresIn: process.env.EXPIRES_IN },
)

module.exports = {
  sign,
  verify,
}
