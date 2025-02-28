// handler/omop/observation_period.js
const observationPeriodService = require("../../services/omop/observation_period");

// 1) List All Observation Periods
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  observationPeriodService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 2) Get Observation Period by Person ID
exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  observationPeriodService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: `No observation periods found for person_id=${person_id}`
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 3) Get Observation Periods by Array of Person IDs
exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;

  observationPeriodService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No observation periods found for the given person_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 4) Search for Observation Periods by Date Range
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body; // { start_date, end_date }

  observationPeriodService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No observation periods found in the specified date range."
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
