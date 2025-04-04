// handler/omop/cohort.js
const cohortService = require("../../services/omop/cohort");

/**
 * 1. List All Cohorts
 */
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  cohortService
    .findAll(page, pageSize, sortOrder)
    .then((cohorts) => res.status(200).json(cohorts))
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 2. Get All Subjects in a Cohort
 */
exports.findByCohortDefinition = (req, res) => {
  const { cohort_definition_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;
  cohortService
    .findByCohortDefinition(cohort_definition_id, page, pageSize, sortOrder)
    .then((subjects) => {
      if (subjects.length > 0) {
        return res.status(200).json(subjects);
      }
      return res.status(404).json({ message: `No subjects found for cohort_definition_id=${cohort_definition_id}` });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
