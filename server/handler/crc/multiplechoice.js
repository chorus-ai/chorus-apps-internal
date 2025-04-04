const crcmultiplechoiceService = require("../../services/crc/multiplechoice");

exports.findByModuleId = (req, res) => {
  const { mid } = req.params;

  crcmultiplechoiceService
    .findByModuleId(mid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = async (req, res) => {
  const { question, A, B, C, D, answer, explanation, index, mid, allQuestions } = req.body;
  const newAllQuestions = JSON.parse(allQuestions);
  const allJobs = [];
  try {
    const newQuestion = await crcmultiplechoiceService
      .create(question, A, B, C, D, answer, explanation, index, mid);
    for (let question of newAllQuestions) {
      if (question.index >= index) {
        const newPromise = new Promise((resolve, reject) => {
          crcmultiplechoiceService
            .update(question.id, { index: question.index + 1 })
            .then(result => {
              resolve(result);
            })
            .catch(err => {
              reject(err);
            });
        });
        allJobs.push(newPromise);
      }

    }
    await Promise.all(allJobs);
    res.send(newQuestion);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

};

exports.bulkCreate = (req, res) => {
  const { quizes } = req.body;

  crcmultiplechoiceService
    .bulkCreate(quizes)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.remove = async (req, res) => {
  const { id, allQuestions } = req.body;
  const newAllQuestions = JSON.parse(allQuestions);
  const allJobs = [];
  try {
    await crcmultiplechoiceService.remove(id);
    for (let question of newAllQuestions) {
      const newPromise = new Promise((resolve, reject) => {
        crcmultiplechoiceService
          .update(question.id, { index: question.index })
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

exports.removeAll = (req, res) => {
  const { mid } = req.params;

  crcmultiplechoiceService
    .removeAll(mid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.update = (req, res) => {
  const { id, body } = req.body;

  crcmultiplechoiceService
    .update(id, JSON.parse(body))
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.recordScore = (req, res) => {
  const { mid, uid, score } = req.body;

  crcmultiplechoiceService
    .recordScore(mid, uid, score)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}