const Project = require('@launchr/db/models/Project')
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')

router.get('/',authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.post('/',authMiddleware, async (req, res) => {
  try {
    const { name, repoUrl} = req.body
    const createdProject = await Project.create({ name, repoUrl,
      userId: req.user._id,
      slug: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
     })
    res.status(201).json(createdProject)
  }
 catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
}
})


router.get('/:id', async (req, res) => {
  try {
      const id = req.params.id 
      const project = await Project.findById(id)
      if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    } 
      res.json(project)
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.delete('/:id',authMiddleware, async (req, res) => {
  try {
      const id = req.params.id 
      const project = await Project.findByIdAndDelete(id)
      if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
      res.json(project)
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message })
    }
})

module.exports = router