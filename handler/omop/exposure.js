const omopExposureService = require('../../services/omop/exposure');

exports.findAllDrugs = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  omopExposureService
    .findAllDrugs(page, pageSize, sortOrder)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAllDevices = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  omopExposureService
    .findAllDevices(page, pageSize, sortOrder)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};