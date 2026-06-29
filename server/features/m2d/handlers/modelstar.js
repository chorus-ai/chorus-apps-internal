const m2dmodelstarService = require("../services/modelstar");

exports.findByModelId = (req, res) => {
  const { mid } = req.params;

  m2dmodelstarService
    .findByModelId(mid)
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      })
    })
};

exports.findByUserId = (req, res) => {
  const { uid } = req.params;

  m2dmodelstarService
    .findByUserId(uid)
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      })
    })
};

exports.findStarStatus = (req, res) => {
  const { uid, mid } = req.params;

  m2dmodelstarService
    .findStarStatus(uid, mid)
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      })
    })
};

exports.create = (req, res) => {
  const { uid, mid } = req.body;
  
  m2dmodelstarService
    .create(uid, mid)
    .then((result) => {
      res.send("Successfully created!")
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      })
    })
};

exports.remove = (req, res) => {
  const { uid, mid } = req.body;
  
  m2dmodelstarService
    .remove(uid, mid)
    .then((result) => {
      res.send("Successfully removed!")
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      })
    })
};