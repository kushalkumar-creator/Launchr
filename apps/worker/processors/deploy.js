const Deployment = require('@launchr/db/models/Deployment')

async function deployProcessor({ deploymentId, repoUrl, buildCmd, outputDir }) {
  await Deployment.findByIdAndUpdate(deploymentId, {
    status: 'building'
  })

  try {
    // Step 2 - run docker build (we'll build this next)
    // Step 3 - upload output (we'll build this after)
    await Deployment.findByIdAndUpdate(deploymentId, {
      status: 'ready',
      finishedAt: new Date()
    })

  } catch (error) {
    await Deployment.findByIdAndUpdate(deploymentId, {
      status: 'failed',
      error: error.message,
      finishedAt: new Date()
    })
  }
}

module.exports = { deployProcessor }