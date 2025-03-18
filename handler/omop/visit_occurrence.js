const visitOccurrenceService = require("../../services/omop/visit_occurrence");

exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  visitOccurrenceService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  visitOccurrenceService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: `No visits found for person_id=${person_id}` });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body; // expecting an array

  visitOccurrenceService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No visits found for the given person_ids" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  visitOccurrenceService
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results[0]);
      return res.status(404).json({
        message: `No visit occurrence found with ID = ${visit_occurrence_id}`
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;

  visitOccurrenceService
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No visits found for the given visit_occurrence_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body; // e.g. { start_date, end_date, person_ids, ... }

  visitOccurrenceService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No visit occurrences found matching the search criteria."
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
