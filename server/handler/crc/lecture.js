const crclectureService = require("../../services/crc/lecture");

exports.findByModuleId = (req, res) => {
  const { mid } = req.params;
  crclectureService
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

exports.create = (req, res) => {
  const { title, link, transcript = "", note = "", mid } = req.body;
  crclectureService
    .create(title, link, transcript, note, mid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.bulkCreate = (req, res) => {
  const { lectures } = req.body;
  crclectureService
    .bulkCreate(lectures)
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
  const { title, link, transcript, note, id } = req.body;
  crclectureService
    .update(title, link, transcript, note, id)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.remove = (req, res) => {
  const { ids } = req.body;
  crclectureService
    .remove(ids)
    .then(() => {
      res.send({ message: 'Successfully removed!' });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};