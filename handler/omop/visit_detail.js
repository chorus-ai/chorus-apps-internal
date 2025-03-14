// handler/omop/visit_detail.js
const visitDetailService = require("../../services/omop/visit_detail");

/**
 * 1. List All Visit Details
 */
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  visitDetailService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 2. Get Visit Detail by Person ID
 */
exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  visitDetailService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: `No visit details found for person_id=${person_id}` });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 3. Get Visit Details by Array of Person IDs
 */
exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;

  visitDetailService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No visit details found for these person_ids" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 4. Get Visit Detail by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  visitDetailService
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res
        .status(404)
        .json({ message: `No visit details found for visit_occurrence_id=${visit_occurrence_id}` });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 5. Get Visit Details by array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;

  visitDetailService
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No visit details found for these visit_occurrence_ids",
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 6. Search Visit Details by Attributes
 */
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;

  visitDetailService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No visit details found matching the search criteria."
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
