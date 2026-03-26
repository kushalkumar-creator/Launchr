const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const Project = require('@launchr/db/models/Project')
const Deployment = require('@launchr/db/models/Deployment')
const { deploymentQueue } = require('../queue')

// trigger a deployment
router.post('/:projectId/deploy', authMiddleware, async (req, res) => {
  try {
    const {projectId} = req.params
    const project = await Project.findById(projectId)
    if (!project) {
        return res.status(404).json({ message: 'Project not found' })
    }
    const deployment = await Deployment.create({
        projectId: project._id,
        status: 'queued',
        commitSha: 'manual'
    })
    await deploymentQueue.add('deploy', {
        deploymentId: deployment._id,
        projectId: project._id,
        repoUrl: project.repoUrl,
        buildCmd: project.buildCmd,
        outputDir: project.outputDir
    })
    res.status(201).json(deployment)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.get('/:projectId', authMiddleware, async (req, res) => {
  try {
    const {projectId} = req.params
    const deployments  = await Deployment.find({ projectId }).sort({ createdAt: -1 })
    res.json(deployments)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.get('/detail/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const deployment = await Deployment.findById(id)
    if (!deployment) {
        return res.status(404).json({ message: 'Deployment not found' })
    }
    res.json(deployment)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router