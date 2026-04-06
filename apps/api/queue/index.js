const { Queue } = require("bullmq")
const { Redis } = require("ioredis")

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  retryStrategy: () => null  // never retry — fail silently
})

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message)
})

const queue = new Queue("deployments", {
  connection: redisClient
})

module.exports = queue