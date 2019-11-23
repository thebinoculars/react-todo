const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('./model');

if (!process.argv[2] || !process.argv[3]) process.exit(0);

const user = {
  username: process.argv[2],
  password: bcrypt.hashSync(process.argv[3], 10),
};

User.create(user)
  .then((data) => {
    jwt.sign(
      { username: data.username, password: data.password },
      process.env.SECRET_KEY,
      { expiresIn: process.env.EXPIRES_IN },
    );
  })
  .catch((err) => console.log(err))
  .finally(() => process.exit(0));
