const omopConditionOccurrenceService = require("../../services/omop/occurrence");

exports.findAllConditions = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  omopConditionOccurrenceService
    .findAllConditions(page, pageSize, sortOrder)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAllProcedures = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  omopConditionOccurrenceService
    .findAllProcedures(page, pageSize, sortOrder)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};