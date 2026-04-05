const { Queue } = require("bullmq")
const { Redis } = require("ioredis")

const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: process.env.REDIS_URL?.includes('rediss://') ? {} : undefined
})

const queue = new Queue("deployments", {
  connection: redisConnection
})

module.exports = queue