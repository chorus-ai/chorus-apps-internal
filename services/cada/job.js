const { Queue } = require("bullmq");

const redisConfiguration = {
  connection: {
    host: "127.0.0.1",
    port: "6379",
  },
};

exports.pushJobs = async (assignments) => {
  // create a queue, or connect to a queue if it exists
  const myQueue = new Queue("myqueue", redisConfiguration);

  try {
    for (let i = 0; i < assignments.length; i++) {
      console.log("assignments: ", assignments[i]);
      const event_info = {
        cadaAnnotationId: String(assignments[i].cadaAnnotations[0].id),
        path: String(assignments[i].cadaFile.path),
      };

      // add to queue
      await myQueue.add(event_info["cadaAnnotationId"], event_info, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
