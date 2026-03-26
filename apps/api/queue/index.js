const { Queue } = require('bullmq')

const connection = {
  host: 'localhost',
  port: 6379
}

const deploymentQueue = new Queue('deployments', { connection })

module.exports = { deploymentQueue }