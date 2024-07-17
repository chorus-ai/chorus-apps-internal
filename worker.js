const { Worker } = require("bullmq");
const cadaprocess_jobs = require("./jobs/cada/process");

const redisConfiguration = {
    connection: {
        host: "127.0.0.1",
        port: "6379",
    },
};

const cadaworker = new Worker("myqueue", cadaprocess_jobs, redisConfiguration);
cadaworker.on("completed", (job) => {
  console.info(`${job.id} has completed!`);
});
cadaworker.on("failed", (job, err) => {
  console.error(`${job.id} has failed with ${err.message}`);
});

