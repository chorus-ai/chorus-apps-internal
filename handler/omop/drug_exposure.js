// handler/omop/drug_exposure.js
const drugExposureService = require("../../services/omop/drug_exposure");

// 1. List all drug exposures
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  drugExposureService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 2. Get Drug Exposure by Person ID
exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  drugExposureService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: `No drug exposures found for person_id=${person_id}` });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 3. Get Drug Exposures by array of Person IDs
exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;

  drugExposureService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No drug exposures found for given person_ids" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 4. Get Drug Exposure by Visit Occurrence ID
exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  drugExposureService
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: `No drug exposures found for visit_occurrence_id=${visit_occurrence_id}`
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 5. Get Drug Exposures by array of Visit Occurrence IDs
exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;

  drugExposureService
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No drug exposures found for given visit_occurrence_ids"
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// 6. Advanced Search
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;

  drugExposureService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({
        message: "No drug exposures found matching the search criteria."
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
