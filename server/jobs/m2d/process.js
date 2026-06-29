const pathModule = require("path");
const child_process = require("child_process");
const m2djobstatusService = require("../../features/m2d/services/jobstatus");
const m2dresultService = require("../../features/m2d/services/result");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (job) => {
  // fileNames and fileContent are arrays
  const { modelId, fileContent } = job.data;

  console.log(`processing result id: ${job.id} for ${modelId}` ); // convert job.id to int and use it to save the result

  // check if this job has been removed at the end
  await m2djobstatusService.create(job.id, "Processing");
  try {
    switch (parseInt(modelId)) {
      default:
        const result = await m2dresultService.findById(job.id);
        const filenames = JSON.parse(result.fileName).filenames;

        let results = {};
        if (fileContent) {
          for (let idx in fileContent) {
            const file_content = fileContent[idx]
            let tmp_res = []
            for (content of file_content){
              signal_str = content.signal.join(',')
              const modelResult = child_process.execSync(
                `conda run -n m2d python python-scripts/${modelId}.py fc ${signal_str}`
              );
              console.log("result: " + modelResult);
              tmp_res = [...tmp_res, ...JSON.parse(modelResult.toString().trim())];
              
            }
            results[filenames[idx]] = '[' + tmp_res.join(',') + ']';
          }
        } else {
          const dirpath = pathModule.join(
            process.env.BUCKET_PATH,
            "/m2d/",
            result.dataSaved
          );

          for (let filename of filenames) {
            let filepath = pathModule.join(dirpath, filename).replace(/\\/g, "/");
            console.log("filepath: ", filepath);
            if (filepath.endsWith(".hea")) {
              continue;
            }
            const modelResult = child_process.execSync(
              `conda run -n m2d python python-scripts/${modelId}.py fp ${filepath}`
            );
            console.log(modelResult);
            results[filename] = modelResult.toString().trim();

            if (filepath.endsWith(".dat") || filepath.endsWith(".mat")) {
              break;
            }
          }
        }

        await m2djobstatusService.create(job.id, "Done");
        await m2dresultService.updateValues(job.id, results);
    }
  } catch (e) {
    await m2dresultService.updateValues(job.id, e.message);
    await m2djobstatusService.create(job.id, "Failed");
  }
};
