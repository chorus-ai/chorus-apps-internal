const m2dresultService = require("../services/result");
const { Queue } = require("bullmq");
const fs = require("fs");
const path = require("path");

const redisConfiguration = {
  connection: {
    host: "127.0.0.1",
    port: "6379",
  },
};

function promiseAllP(items, block) {
  const promises = [];
  items.forEach(function (item, index) {
    promises.push(
      (function (item, i) {
        return new Promise(function (resolve, reject) {
          return block.apply(this, [item, index, resolve, reject]);
        });
      })(item, index)
    );
  });
  return Promise.all(promises);
} //promiseAll

function readFiles(dirname) {
  return new Promise((res, rej) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) return rej(err);
      promiseAllP(filenames, (filename, index, resolve, reject) => {
        fs.readFile(
          path.resolve(dirname, filename),
          "utf-8",
          (err, content) => {
            if (err) return reject(err);
            return resolve({ filename: filename, contents: content });
          }
        );
      })
        .then((results) => {
          return res(results);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  });
}

exports.findById = (req, res) => {
  const { rid } = req.params;
  m2dresultService
    .findById(rid)
    .then((result) => {
      // res.send(result)
      // load uploaded files
      if (result.dataValues.dataSaved && result.dataValues.m2dModelId !== 2) {
        const file_dir = path.join(
          process.env.BUCKET_PATH,
          "/m2d//uploads/",
          JSON.stringify(result.dataValues.id)
        );
        readFiles(file_dir).then((files) => {
          // console.log('loaded', files.length)
          res.send({ result, files });
        });
      } else {
        res.send({ result, files: null });
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500, {
        message: err.message,
      });
    });
};

exports.findByUserId = (req, res) => {
  const { uid } = req.body;

  m2dresultService
    .findAllByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.remove = async (req, res) => {
  const { rid } = req.params;

  try {
    const result = await m2dresultService.findById(rid);
    if (result && result.m2dJobStatuses && result.m2dJobStatuses.length > 0) {
      if (
        !result.m2dJobStatuses.some((js) => js.status === "Processing") ||
        result.m2dJobStatuses.some((js) => js.status === "Done") ||
        result.m2dJobStatuses.some((js) => js.status === "Failed")
      ) {
        const mlQueue = new Queue("mlqueue", redisConfiguration);
        const job = await mlQueue.getJob(rid);
        if (job) {
          await job.remove();
        }

        await m2dresultService.destroy(rid);
        res.send({ result: "succeed" });
      } else {
        res.send({ result: "Job processing!" });
      }
    }
  } catch (err) {
    res.sendStatus(500, {
      message: err.message,
    });
  }
};
