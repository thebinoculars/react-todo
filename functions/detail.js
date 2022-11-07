const { Project } = require('../services/mongo')
const auth = require('../middleware/auth')

exports.handler = async ({ headers, queryStringParameters: { id } }) => {
  try {
    await auth(headers)
    if (!id) {
      throw new Error('Missing id')
    }

    const project = await Project.findById(id).exec()
    if (!project) {
      throw new Error('Project not found')
    }

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
