// handler/omop/device_exposure.js
const deviceExposureService = require("../../services/omop/device_exposure");

/**
 * 1. List All Device Exposures
 */
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  deviceExposureService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 2. Get Device Exposure by Person ID
 */
exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;
  deviceExposureService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: `No device exposures found for person_id=${person_id}` });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 3. Get Device Exposures by Array of Person IDs
 */
exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;
  deviceExposureService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No device exposures found for provided person_ids" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 4. Get Device Exposure by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;
  deviceExposureService
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: `No device exposures found for visit_occurrence_id=${visit_occurrence_id}` });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 5. Get Device Exposures by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;
  deviceExposureService
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No device exposures found for provided visit_occurrence_ids" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 6. Advanced Search Device Exposures by Attributes
 */
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;
  deviceExposureService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No device exposures found matching the search criteria." });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
