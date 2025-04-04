const crcpermissionService = require('../../services/crc/permission');

exports.findByUserId = (req, res) => {
  const { uid } = req.params;

  crcpermissionService
    .findByUserId(uid)
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
  const { type, uid } = req.body;

  crcpermissionService
    .create(type, uid)
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
  const { id } = req.params;

  crcpermissionService
    .remove(id)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.removeByType = (req, res) => {
  const { type, uid } = req.body;

  crcpermissionService
    .removeByType(type, uid)
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

  crcpermissionService
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

exports.bulkCreate = (req, res) => {
  const { permissions } = req.body;

  crcpermissionService
    .bulkCreate(permissions)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};