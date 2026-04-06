require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const { Worker } = require('bullmq')
const { Redis } = require('ioredis')
const { connectDB } = require('../../packages/db/index')
const { deployProcessor } = require('./processors/deploy')

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined
})

const processor = async (job) => {
  console.log("👀 Incoming job:", job.name, job.data)
  try {
    if (job.name === 'deploy') {
      await deployProcessor(job.data)
    } else {
      console.error(`Unknown job type: ${job.name}`)
    }
  } catch (error) {
    console.log(`Job ${job.id} failed:`, error.message)
  }
}

async function startWorker() {
  await connectDB()

  const worker = new Worker('deployments', processor, {
    connection: redisConnection
  })

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
  })

  worker.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed:`, error.message)
  })

  console.log('Worker started, waiting for jobs...')
}

startWorker()