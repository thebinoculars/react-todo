const bcrypt = require('bcrypt')
const { sign } = require('./jwt')

const { User } = require('./mongo')

if (!process.argv[2] || !process.argv[3]) {
  process.exit(0)
}

const user = {
  username: process.argv[2],
  password: bcrypt.hashSync(process.argv[3], 10),
}

User.create(user)
  .then(({ username, password }) => {
    sign({ username, password })
  })
  .catch((err) => console.log(err))
  .finally(() => process.exit(0))
