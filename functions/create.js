const { Project } = require('../services/mongo')
const auth = require('../middleware/auth')

exports.handler = async ({ headers, body }) => {
  try {
    await auth(headers)

    const { title, tasks } = JSON.parse(body)
    if (!title || !tasks) {
      throw new Error('Missing required parameters')
    }

    const project = await Project.create({ title, tasks })

    return {
      statusCode: 200,
      body: JSON.stringify(project),
    }
  } catch ({ message }) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
    }
  }
}
