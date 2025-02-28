// handler/omop/procedure_occurrence.js
const procedureOccurrenceService = require("../../services/omop/procedure_occurrence");

// 1. List All Procedure Occurrences
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  procedureOccurrenceService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 2. Get Procedure Occurrence by Person ID
exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  procedureOccurrenceService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: `No procedure occurrences found for person_id=${person_id}`
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 3. Get Procedure Occurrences by Array of Person IDs
exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;

  procedureOccurrenceService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No procedure occurrences found for the given person_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 4. Get Procedure Occurrence by Visit Occurrence ID
exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  procedureOccurrenceService
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: `No procedure occurrences found for visit_occurrence_id=${visit_occurrence_id}`
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 5. Get Procedure Occurrences by Array of Visit Occurrence IDs
exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;

  procedureOccurrenceService
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No procedure occurrences found for the given visit_occurrence_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 6. Search for Procedure Occurrences
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;

  procedureOccurrenceService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No procedure occurrences found matching the search criteria."
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
