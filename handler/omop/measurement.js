const omopMeasurementServices = require("../../services/omop/measurement");

exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  omopMeasurementServices
    .findAll(page, pageSize, sortOrder)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.search = (req, res) => {
  const { name, page, pageSize, sortOrder } = req.query;
  omopMeasurementServices
    .search(name, page, pageSize, sortOrder)
    .then((result) => {
      if (result) return res.status(200).json(result);
      return res.status(404).send({ message: "No measurement found." });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  omopMeasurementServices
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((result) => {
      if (result.length > 0) return res.status(200).json(result);
      return res.status(404).send({ message: `No measurements for person_id=${person_id}` });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;

  omopMeasurementServices
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((result) => {
      if (result.length > 0) return res.status(200).json(result);
      return res.status(404).send({ message: "No measurements found for given person_ids" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  omopMeasurementServices
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((result) => {
      if (result.length > 0) return res.status(200).json(result);
      return res.status(404).send({ message: `No measurements for visit_occurrence_id=${visit_occurrence_id}` });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;

  omopMeasurementServices
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((result) => {
      if (result.length > 0) return res.status(200).json(result);
      return res.status(404).send({ message: "No measurements found for given visit_occurrence_ids" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;  // e.g. { start_date, end_date, person_ids, ... }

  omopMeasurementServices
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((result) => {
      if (result.length > 0) return res.status(200).json(result);
      return res.status(404).send({ message: "No measurements found matching the search criteria." });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
