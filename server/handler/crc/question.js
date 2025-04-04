const crcquestionService = require("../../services/crc/question");

exports.findByModuleId = (req, res) => {
  const { mid } = req.params;
  crcquestionService
    .findByModuleId(mid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.updateAll = async (req, res) => {
  const { mid, contents } = req.body;
  const newData = JSON.parse(contents).map(item => {
    return {
      'question': item.question,
      'index': item.index,
      'crcModuleId': mid,
    }
  });

  try {
    await crcquestionService.destroyAll(mid);
    const newContents = await crcquestionService.bulkCreate(newData);
    res.send(newContents);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.create = (req, res) => {
  const { mid, content, index } = req.body;
  crcquestionService
    .create(content, index, mid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.updateContent = (req, res) => {
  const { id, content } = req.body;

  crcquestionService
    .updateContent(id, content)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.updateOrder = (req, res) => {
  const { contents } = req.body;
  const newContents = JSON.parse(contents);
  const allJobs = [];
  for (let content of newContents) {
    const newPromise = new Promise((resolve, reject) => {
      crcquestionService
        .updateOrder(content.id, content.index)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
    allJobs.push(newPromise);
  }
  Promise.all(allJobs)
    .then(() => {
      res.send({message: "Successfully updated!"});
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.destroy = async (req, res) => {
  const { id, allContents } = req.body;
  const newAllContents = JSON.parse(allContents);
  const allJobs = [];
  try {
    await crcquestionService.destroy(id);
    for (let content of newAllContents) {
      const newPromise = new Promise((resolve, reject) => {
        crcquestionService
          .updateOrder(content.id, content.index)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
      allJobs.push(newPromise);
    }
    await Promise.all(allJobs);
    res.send({ message: "Successfully removed!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};