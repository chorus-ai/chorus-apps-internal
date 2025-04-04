const crccompetenciesandevalService = require("../../services/crc/competenciesandeval");

exports.findByModuleId = (req, res) => {
  const { mid } = req.params;
  crccompetenciesandevalService
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
      'content': item.content,
      'index': item.index,
      'crcModuleId': mid,
    }
  });

  try {
    await crccompetenciesandevalService.destroyAll(mid);
    const newContents = await crccompetenciesandevalService.bulkCreate(newData);
    res.send(newContents);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.create = (req, res) => {
  const { mid, content, index } = req.body;
  crccompetenciesandevalService
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

  crccompetenciesandevalService
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
      crccompetenciesandevalService
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
  // console.log(allJobs);
  Promise.all(allJobs)
    .then(() => {
      res.send({ message: "Successfully updated!" });
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
    await crccompetenciesandevalService.destroy(id);
    for (let content of newAllContents) {
      const newPromise = new Promise((resolve, reject) => {
        crccompetenciesandevalService
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