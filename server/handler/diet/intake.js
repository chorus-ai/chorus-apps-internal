const intakeService = require('../../services/diet/intake');

exports.findByUser = (req, res) => {
  const { uid } = req.params;

  intakeService
    .findByUser(uid)
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
  const { id } = req.params;

  intakeService
    .findById(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = (req, res) => {
  const { content } = req.body;

  intakeService
    .create(content)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  intakeService
    .update(id, content)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  intakeService
    .delete(id)
    .then(() => {
      res.send({
        message: 'Deleted',
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};