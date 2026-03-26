require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const { Worker } = require('bullmq')
const { connectDB } = require('@launchr/db')

const connection = {
  host: 'localhost',
  port: 6379
}

const processor = async (job) => {
  
  console.log('Processing job:', job.data)
}

async function startWorker() {
  await connectDB()

  const worker = new Worker('deployments',processor,{connection})
  worker.on('failed',(job,error)=>{
    console.error(`Job ${job.id} failed:`, error.message)
  })
  console.log('Worker started, waiting for jobs...')
}

startWorker()