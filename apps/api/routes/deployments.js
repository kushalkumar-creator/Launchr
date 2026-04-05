const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Deployment = require("../../../packages/db/models/Deployment")
const Project = require("../../../packages/db/models/Project")
const queue = require("../queue")
const authMiddleware = require("../middleware/auth")

// get all deployments for a project
router.get("/project/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" })
    }

    const deployments = await Deployment.find({ projectId })
      .sort({ createdAt: -1 })
      .limit(10)

    res.json(deployments)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// get one deployment by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id)
    if (!deployment) {
      return res.status(404).json({ message: "Deployment not found" })
    }
    res.json(deployment)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// trigger a deployment
router.post("/:projectId/deploy", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    const deployment = await Deployment.create({
      projectId: project._id,
      status: "queued",
      logs: [],
    })

    await queue.add("deploy", {
      deploymentId: deployment._id,
      repoUrl: project.repoUrl,
    })

    console.log("Job added to queue")

    res.status(201).json({
      message: "Deployment queued",
      deploymentId: deployment._id,
      status: deployment.status,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

module.exports = router