const omopVisitSerivce = require("../../services/omop/visit");

exports.findAllDetail = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;

  omopVisitSerivce
  .findAllDetail(page, pageSize, sortOrder)
  .then((result) => res.status(200).json(result))
  .catch((err) => {
    res.status(500).send({
      message: err.message,
    });
  });
};

exports.findAllOccurrence = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;

  omopVisitSerivce
  .findAllOccurrence(page, pageSize, sortOrder)
  .then((result) => res.status(200).json(result))
  .catch((err) => {
    res.status(500).send({
      message: err.message,
    });
  });
};