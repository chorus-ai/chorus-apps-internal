const { queue: myQueue } = require("../jobs");

exports.pushJobs = async (assignments) => {
  try {
    for (let i = 0; i < assignments.length; i++) {
      console.log("assignments: ", assignments[i]);
      const event_info = {
        cadaAnnotationId: String(assignments[i].cadaAnnotations[0].id),
        path: String(assignments[i].cadaFile.path),
      };

      await myQueue.add(event_info["cadaAnnotationId"], event_info, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
