require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Project, User } = require('./model');

const app = express();

const PORT = process.env.PORT || 4000;

const middleware = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(401).json({ message: 'Missing token' });
  } else {
    jwt.verify(token, process.env.SECRET_KEY, (err) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        next();
      }
    });
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('build'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Missing username/password' });
  } else {
    User.findOne({ username }, (err, user) => {
      if (err) {
        res.status(400).json({ message: 'Something went wrong' });
      } else if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(400).json({ message: 'Username/Password not match' });
      } else {
        const token = jwt.sign(
          { username: user.username, password: user.password },
          process.env.SECRET_KEY,
          { expiresIn: process.env.EXPIRES_IN },
        );
        res.status(200).json({ token });
      }
    });
  }
});

app.get('/api/list', middleware, (req, res) => {
  Project.find({})
    .then((projects) => res.status(200).json(projects))
    .catch(() => res.status(400).json({ message: 'Something went wrong' }));
});

app.post('/api/create', middleware, (req, res) => {
  const { title, task } = req.body;
  Project.create({ title, task })
    .then((project) => res.status(200).json(project))
    .catch(() => res.status(400).json({ message: 'Something went wrong' }));
});

app.get('/api/detail/:id', middleware, (req, res) => {
  Project.findById(req.params.id)
    .then((project) => res.status(200).json(project))
    .catch(() => res.status(400).json({ message: 'Something went wrong' }));
});

app.post('/api/update/:id', middleware, (req, res) => {
  const { title, tasks } = req.body;
  Project.findByIdAndUpdate(req.params.id, { title, tasks })
    .then((project) => res.status(200).json(project))
    .catch(() => res.status(400).json({ message: 'Something went wrong' }));
});

app.get('/api/delete/:id', middleware, (req, res) => {
  Project.findByIdAndDelete({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Project deleted successfully' }))
    .catch(() => res.status(400).json({ message: 'Something went wrong' }));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname }/build/index.html`));
});
