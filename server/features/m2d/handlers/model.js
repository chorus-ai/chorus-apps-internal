const m2dmodelService = require("../services/model");
const m2dresultService = require("../services/result");
const m2djobstatusService = require("../services/jobstatus");
const m2dprojectmodelService = require("../services/projectmodel.js");
const m2dmodeluserService = require("../services/modeluser");
const fs = require("fs");
const path = require("path");
const { Queue } = require("bullmq");
require("events").EventEmitter.defaultMaxListeners = 100;

const redisConfiguration = {
  connection: {
    host: "127.0.0.1",
    port: "6379",
  },
};

exports.findAll = (req, res) => {
  m2dmodelService
    .findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findById = (req, res) => {
  const { uid, mid } = req.body;

  m2dmodelService
    .findById(mid)
    .then(async (result) => {
      const users = result.dataValues.users;
      if (
        users.find((user) => user.id === uid) ||
        result.dataValues.approveStatus === "Approved"
      ) {
        const modelCardPath = path.join(
          process.env.BUCKET_PATH,
          "/m2d/model_cards/",
          `${mid}/${mid}.md`
        );
        let modelCard;
        try {
          modelCard = await new Promise((resolve, reject) => {
            fs.readFile(modelCardPath, "utf-8", (err, data) => {
              if (err) reject(2)
              resolve(data);
            });
          })
          
        } catch (err) {
          modelCard = null
        }
        if (result.dataValues.exampleFile) {
          const sampleFilePath = path.join(
            process.env.BUCKET_PATH,
            "/m2d/example_files/",
            result.dataValues.exampleFile + ".json"
          );
          let sampleData;
          try {
            // sampleData = await new Promise((resolve, reject) => {
            //   fs.readFile(sampleFilePath, "utf-8", (err, data) => {
            //     if (err) reject(1)
            //     resolve(JSON.parse(data));
            //   });
            // })
            sampleData = fs.readFileSync(sampleFilePath, "utf-8");
            sampleData = JSON.parse(sampleData);
          } catch (err) {
            sampleData = null
          }

          res.send({ result, sampleData, modelCard })
        } else {
          res.send({ result, sampleData: null, modelCard: modelCard });
        }
      } else {
        res.send("Access denied!");
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAllModelNamesAndIdsByUserId = (req, res) => {
  const { uid } = req.body;

  m2dmodelService
    .findAllModelNamesAndIdsByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findUnapprovedModelsByUserId = (req, res) => {
  const { uid } = req.body;

  m2dmodelService
    .findUnapprovedModelsByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAllModelInputTypes = (req, res) => {
  m2dmodelService
    .findAllModelInputTypes()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.findAllModelResultTypes = (req, res) => {
  m2dmodelService
    .findAllModelResultTypes()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findByUserId = (req, res) => {
  const { uid } = req.params;

  m2dmodelService
    .findByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.vpptest = async (req, res) => {
  const { link, year, uid } = req.body;
  const mlQueue = new Queue("mlqueue", redisConfiguration);

  try {
    const filename = `${link} ${year}`
    result = await m2dresultService.create(uid, 4, [filename], null);
    await m2djobstatusService.create(result.dataValues.id);

    mlQueue.add(
      result.dataValues.id,
      {
        modelId: result.dataValues.m2dModelId,
        userId: result.dataValues.userId,
        fileContent: [`${link} ${year}`]
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
        jobId: JSON.stringify(result.dataValues.id),
      }
    );

    res.send({ status: "done" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

exports.test = async (req, res) => {
  const { consent, mid, uid } = req.body;
  const mlQueue = new Queue("mlqueue", redisConfiguration);

  if (consent !== "true") {
    const { files } = req;
    // get file names
    let fileNames = [];
    for (let i = 0; i < files.length; i++) {
      fileNames.push(files[i].originalname);
    }

    let result = null
    try {
      result = await m2dresultService.create(uid, mid, fileNames, null);
      await m2djobstatusService.create(result.dataValues.id);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }

    // add record to result table

    const fileContent = [];
    for (let file of files) {
      // console.log(file)
      // fileContent.push(Buffer.from(file.buffer).toString('utf-8'))
      if (file.mimetype === "text/csv") {
        console.log("file is a csv file");
        fileContent.push(Buffer.from(file.buffer).toString("utf-8"));
      } else if (file.mimetype === "application/json") {
        let c = JSON.parse(Buffer.from(file.buffer).toString("utf-8"));
        console.log(c)
        if (c.length === 1 && Array.isArray(c[0])) {
          c = c[0]
        }
        fileContent.push(c);
        // } else if (file.mimetype === 'application/octet-stream') {
        //     if (file.originalname.endsWith('.hea')) {
        //         console.log("logging header file")
        //         const content = {};
        //         const lines = Buffer.from(file.buffer).toString('utf-8').split('\n');
        //         for (let line of lines) {
        //             const [key, value] = line.split(' ');
        //             content[key] = value
        //         }
        //         wfdbcontent['header'] = content
        //     } else {
        //         const buffer = Buffer.from(file.buffer)
        //         const content = [];
        //         const bytesPerSample = 2; // assuming 12-bit data
        //         const numSamples = buffer.length / bytesPerSample;
        //         for (let i = 0; i < numSamples; i++) {
        //             const offset = i * bytesPerSample;
        //             const sample = buffer.readUInt16LE(offset);
        //             const value = (sample & 0xFFF); // extract the lower 12 bits
        //             content.push(value);
        //         }
        //         wfdbcontent['data'] = content
        //     }
      } else {
        console.error(`Unsupported file type: ${file.mimetype}`);
        continue;
      }
    }

    mlQueue.add(
      result.dataValues.id,
      {
        modelId: result.dataValues.m2dModelId,
        userId: result.dataValues.userId,
        fileContent,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
        jobId: JSON.stringify(result.dataValues.id),
      }
    );

    res.send({ status: "done" });
  } else {
    const {
      files,
      body: { name, index, total, fileIndex, totalFileNumber, resultId },
    } = req;
    // const suffix = name.slice(-4);
    const file = files[0];
    let rid = parseInt(resultId);
    try {
      if (rid === -1) {
        // get result id
        const result = await m2dresultService.create(uid, mid, null, null);

        rid = result.dataValues.id;
      }

      const UPLOAD_DIR = `${process.env.BUCKET_PATH}/m2d//uploads/${rid}/`;
      fs.mkdir(UPLOAD_DIR, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Directory created!");
          fs.writeFile(
            `${UPLOAD_DIR}${name}-${index}`,
            Buffer.from(file.buffer, "binary"),
            { flag: "w" },
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to write file" });
              } else {
                // console.log(`got the ${index}th file of ${hash}`);
                if (parseInt(index) === parseInt(total) - 1) {
                  const buffers = [];
                  for (let i = 0; i < parseInt(total); i++) {
                    const buffer = fs.readFileSync(`${UPLOAD_DIR}${name}-${i}`);
                    buffers.push(buffer);
                  }
                  const data = Buffer.concat(buffers);
                  fs.writeFile(
                    `${UPLOAD_DIR}${name}`,
                    data,
                    { flag: "w" },
                    (err) => {
                      if (err) {
                        console.error(err);
                        res
                          .status(500)
                          .json({ message: "Failed to write file" });
                      } else {
                        for (let i = 0; i < parseInt(total); i++) {
                          fs.unlinkSync(`${UPLOAD_DIR}${name}-${i}`);
                        }

                        if (
                          parseInt(fileIndex) !==
                          parseInt(totalFileNumber) - 1
                        ) {
                          // if it's not the last file
                          res.json({ resultId: rid });
                        } else {
                          // read all file names
                          fs.readdir(UPLOAD_DIR, async (err, files) => {
                            if (err) {
                              res.status(500).send({
                                message: err.message,
                              });
                            }

                            await m2dresultService.update(
                              files,
                              `uploads/${rid}/`,
                              rid
                            );

                            await m2djobstatusService.create(rid);

                            await mlQueue.add(
                              rid,
                              {
                                modelId: mid,
                                userId: uid,
                                fileContent: null,
                              },
                              {
                                removeOnComplete: true,
                                removeOnFail: true,
                                jobId: JSON.stringify(rid),
                              }
                            );
                          });
                          res.json({ message: "File saved successfully" });
                        }
                      }
                    }
                  );
                } else {
                  res.json({ message: "File slice received" });
                }
              }
            }
          );
        }
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  }
};

exports.create = async (req, res) => {
  const {
    files,
    body: {
      uid,
      mid,
      index,
      total,
      name,
      version,
      details,
      dataDescription,
      modelInputType,
      modelResultType,
    },
  } = req;

  let modelId = -1;
  let chunk = files[0];

  try {
    if (mid === "-1") {
      const result = await m2dmodelService.create(
        name,
        version,
        details,
        dataDescription,
        modelInputType,
        modelResultType
      );
      modelId = result.dataValues.Id;

      await m2dmodeluserService.create(modelId, uid);
    } else {
      modelId = parseInt(mid);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  const UPLOAD_DIR = `${process.env.BUCKET_PATH}/m2d//models/${modelId}/`;
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdir(UPLOAD_DIR, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Directory created!");
      }
    });
  }
  // write and save individual chunk
  fs.writeFile(
    `${UPLOAD_DIR}${name}-${index}`,
    Buffer.from(chunk.buffer, "binary"),
    { flag: "w" },
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to write file" });
      } else {
        // last chunk
        if (parseInt(index) === parseInt(total) - 1) {
          // read all file names
          fs.readdir(UPLOAD_DIR, (err, files) => {
            if (err) {
              res.status(500).send({
                message: err.message,
              });
            }
            // create a write stream for the output file
            const outputStream = fs.createWriteStream(
              `${process.env.BUCKET_PATH}/m2d//models/${modelId}`
            );

            // loop through each file in the folder
            files.forEach((file) => {
              const filePath = `${UPLOAD_DIR}${file}`;
              // read the contents of the file
              const fileContents = fs.readFileSync(filePath, "utf-8");
              outputStream.write(fileContents);
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`File ${filePath} deleted successfully`);
                }
              });
            });
            outputStream.end();
            fs.rmdir(UPLOAD_DIR, (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Directory deleted successfully");
              }
            });
          });
          res.json({ message: "File saved successfully" });
        } else if (parseInt(index) === 0) {
          res.json({ modelId: modelId });
        } else {
          res.json({ message: "File slice received" });
        }
      }
    }
  );
};

exports.createModelCard = async (req, res) => {
  const {
    uids,
    name,
    version,
    details,
    dataDescription,
    modelInputType,
    modelResultType
  } = req.body;

  try {
    const result = await m2dmodelService.create(
      name,
      version,
      details,
      dataDescription,
      modelInputType,
      modelResultType,
    );
    modelId = result.dataValues.id;
    await m2dmodeluserService.bulkCreate(uids, modelId);

    res.send({ message: "success" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.edit = async (req, res) => {
  const {
    mid,
    name,
    inputTypeId,
    resultTypeId,
    version,
    details,
    dataDescription,
    exampleFile,
    uids,
    needApprove,
  } = req.body;

  try {
    await m2dmodelService.update(
      mid,
      name,
      inputTypeId,
      resultTypeId,
      version,
      details,
      dataDescription,
      exampleFile,
      needApprove
    );

    await m2dmodeluserService.destroy(mid);

    m2dmodeluserService.bulkCreate(uids, mid);

    res.send("Successfully updated!");
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.remove = async (req, res) => {
  const { mid, uid } = req.body

  try {
    const allModelUsers = await m2dmodelService.findModelUsersByModelId(mid)
    if (!allModelUsers.find((pu) => pu.dataValues.userId === uid)) {
      res.status(500).send({
        message: "You don't have the permission to remove this model!",
      });
    } else {
      if (allModelUsers.length === 1) {
        await m2dmodelService.remove(mid);
        res.send("Successfully removed!");
      } else {
        await m2dmodelService.removeUserFromModel(uid, mid);
        res.send("Successfully removed!");
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.search = (req, res) => {
  const { attributes, exMids, status, searchString, limit } = req.body;

  m2dmodelService
    .search(attributes, exMids, status, searchString, limit)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}
