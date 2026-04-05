require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const { Worker } = require('bullmq')
const { connectDB } = require('@launchr/db')
const { deployProcessor } = require('./processors/deploy')
const connection = process.env.REDIS_URL ? 
  { url: process.env.REDIS_URL } : 
  { host: 'localhost', port: 6379 }

const processor = async (job) => {
  console.log("👀 Incoming job:", job.name, job.data); // ADD THIS

  try {
    if (job.name === 'deploy') {
      await deployProcessor(job.data)
    } else {
      console.error(`Unknown job type: ${job.name}`)
    }
  } catch (error) {
    console.log(`Job ${job.id} failed:`, error.message);
  }
}

async function startWorker() {
  await connectDB()

  const worker = new Worker('deployments', processor, { connection })

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
  })

  worker.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed:`, error.message)
  })

  console.log('Worker started, waiting for jobs...')
}

startWorker()