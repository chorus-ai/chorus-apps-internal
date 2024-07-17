const db = require("../../models");
const omopPersonServices = require("../../services/omop/person");

exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  omopPersonServices
    .findAll(page, pageSize, sortOrder)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findByConcept = (req, res) => {
  const { cid } = req.params;

  omopPersonServices
    .findByConcept(cid)
    .then((result) => {
      if (result)
        return res.status(200).json(result)
      return res.status(404).send({"message": "No person found."})
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}