const { Queue } = require("bullmq");

const queue = new Queue("deployments", {
  connection: {
    host: "localhost",
    port: 6379
  }
});

module.exports = queue;