const { Queue } = require("bullmq")

console.log("REDIS_URL:", process.env.REDIS_URL) // temporary debug

const connection = {
  url: process.env.REDIS_URL || "redis://localhost:6379",
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
}

const queue = new Queue("deployments", { connection })

module.exports = queue