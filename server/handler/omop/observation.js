// handler/omop/observation.js
const observationService = require("../../services/omop/observation");

// 1. List All Observations
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  observationService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 2. Get Observation by Person ID
exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  observationService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: `No observations found for person_id=${person_id}` });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 3. Get Observations by Array of Person IDs
exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;  // expecting an array

  observationService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No observations found for the given person_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 4. Get Observation by Visit Occurrence ID
exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  observationService
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: `No observations found for visit_occurrence_id=${visit_occurrence_id}`
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 5. Get Observations by Array of Visit Occurrence IDs
exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;

  observationService
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No observations found for the given visit_occurrence_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 6. Search Observations by Various Attributes
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;  // e.g. { start_date, end_date, person_ids, ... }

  observationService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No observations found matching the search criteria."
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
