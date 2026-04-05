require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })

const express = require("express")
const cors = require("cors")
const { connectDB } = require('../../packages/db/index')
const passport = require('passport')

const http = require("http")
const { Server } = require("socket.io")
const Redis = require("ioredis")

const app = express()

app.use(cors())
app.use(express.json())
app.use(passport.initialize())

app.use('/api/projects', require('./routes/projects'))
app.use('/api/auth', require('./routes/auth'))
app.use("/api/deployments", require("./routes/deployments"))

app.get('/health', (req, res) => {
  res.json({ status: "ok" })
})


const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  console.log("Client connected")

  socket.on("join", (deploymentId) => {
    socket.join(deploymentId)
    console.log("Joined room:", deploymentId)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})


const sub = new Redis()

sub.subscribe("deployment-logs")

sub.on("message", (channel, message) => {
  if (channel === "deployment-logs") {
    const { deploymentId, log } = JSON.parse(message)

    console.log("📡 Sending log to client:", log)

    io.to(deploymentId).emit("log", log)
  }
})


async function startServer() {
  await connectDB()

  server.listen(process.env.PORT || 4000, () => {
    console.log(`API + Socket running on port ${process.env.PORT || 4000}`)
  })
}

startServer()