require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const express = require('express')
const httpProxy = require('http-proxy')
const { connectDB } = require('../../packages/db/index')
const Deployment = require('../../packages/db/models/Deployment')

const app = express()
const proxy = httpProxy.createProxyServer({})

proxy.on('error', (err, req, res) => {
  res.status(502).send('App is starting up, please wait...')
})

app.use(async (req, res) => {
  try {
    const deploymentId = req.path.split('/')[1]
    if (!deploymentId || deploymentId.length !== 24) {
      return res.status(400).send('Invalid deployment URL')
    }
    const deployment = await Deployment.findById(deploymentId)
    if (!deployment || !deployment.port) {
      return res.status(404).send('Deployment not found')
    }
    req.url = '/' + req.path.split('/').slice(2).join('/')
    proxy.web(req, res, { 
      target: `http://localhost:${deployment.port}` 
    })
  } catch (err) {
    res.status(500).send('Error: ' + err.message)
  }
})

async function start() {
  await connectDB()
  app.listen(3500, () => {
    console.log('Proxy running on port 3500')
  })
}

start()