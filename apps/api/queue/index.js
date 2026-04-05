const { Queue } = require("bullmq");

const connection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : { host: "localhost", port: 6379 };

const queue = new Queue("deployments", { connection });

module.exports = queue;