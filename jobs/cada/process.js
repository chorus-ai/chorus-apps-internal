const pathModule = require("path");
const child_process = require("child_process");
const cadaeventService = require("../../services/cada/event");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (job) => {
  const { cadaAnnotationId, path } = job.data;

  const filepath = pathModule.join(process.env.BUCKET_PATH, path);
  console.log(`processing ${job.id} for ${cadaAnnotationId} with ${filepath}`);

  try {
    let result = child_process.execSync(
      `conda run -n chorusenv python python-scripts/1.py fp ${filepath}`
    );
    result = result.toString().trim();
    console.log("result: ", result);

    await cadaeventService.createAnnotationValue(
      "afib-model",
      result,
      cadaAnnotationId,
      new Date()
    );
    await cadaeventService.updateAnnotationComplete(cadaAnnotationId);
  } catch (e) {
    console.error(e);
  }
};
