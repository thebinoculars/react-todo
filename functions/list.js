const { Project } = require('../services/mongo')
const auth = require('../middleware/auth')

exports.handler = async ({ headers }) => {
  try {
    await auth(headers)

    const projects = await Project.find({}).exec()

    return {
      statusCode: 200,
      body: JSON.stringify(projects),
    }
  } catch ({ message }) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
    }
  }
}
