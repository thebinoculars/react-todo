require('dotenv').config()
const mongoose = require('mongoose')

const { Schema } = mongoose

const DB = process.env.DB || 'mongodb://localhost:27017/todo'

mongoose.connect(DB)

const Task = new Schema()

Task.add({
  title: String,
  dueDate: Number,
  createdAt: Number,
  completedAt: Number,
  priority: String,
  description: String,
  tasks: [Task],
})

const Project = mongoose.model('Project', {
  title: String,
  tasks: [Task],
})

const User = mongoose.model('User', {
  username: String,
  password: String,
})

module.exports = { mongoose, Project, User }
