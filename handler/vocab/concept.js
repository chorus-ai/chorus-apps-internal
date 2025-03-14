const omopConceptServices = require("../../services/vocab/concept");

exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  omopConceptServices
    .findAll(page, pageSize, sortOrder)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });

};

exports.findById = (req, res) => {
  const { cid } = req.params;

  omopConceptServices
    .findById(cid)
    .then((result) => {
      if (result)
        return res.status(200).json(result)
      return res.status(404).send({ "message": "Concept not found." })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.searchByName = (req, res) => {
  const { name, page = 1, pageSize = 10, exactMatch = false } = req.query;

  omopConceptServices
    .searchByName(name, parseInt(page), parseInt(pageSize), JSON.parse(exactMatch))
    .then((result) => {
      if (result && result.length > 0)
        return res.status(200).json(result)
      return res.status(404).send({ "message": "No concept found." })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};