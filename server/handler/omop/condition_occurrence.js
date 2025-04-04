// handler/omop/conditionOccurrence.js
const conditionOccurrenceService = require("../../services/omop/condition_occurrence");

// 1. List All Condition Occurrences
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  conditionOccurrenceService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 2. Get Condition Occurrence by Person ID
exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  conditionOccurrenceService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: `No condition occurrences found for person_id=${person_id}`
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 3. Get Condition Occurrences by Array of Person IDs
exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;

  conditionOccurrenceService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No condition occurrences found for the given person_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 4. Get Condition Occurrence by Visit Occurrence ID
exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  conditionOccurrenceService
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: `No condition occurrences found for visit_occurrence_id=${visit_occurrence_id}`
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 5. Get Condition Occurrences by Array of Visit Occurrence IDs
exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;

  conditionOccurrenceService
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No condition occurrences found for the given visit_occurrence_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 6. Search for Condition Occurrences
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;

  conditionOccurrenceService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No condition occurrences found matching the search criteria."
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
