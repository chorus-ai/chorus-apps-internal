// handler/omop/cohortDefinition.js
const cohortDefinitionService = require("../../services/omop/cohort_definition");

/**
 * 1. List All Cohort Definitions
 */
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  cohortDefinitionService
    .findAll(page, pageSize, sortOrder)
    .then((definitions) => res.status(200).json(definitions))
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 2. Get Cohort Definition by ID
 */
exports.findById = (req, res) => {
  const { cohort_definition_id } = req.params;

  cohortDefinitionService
    .findById(cohort_definition_id)
    .then((definition) => {
      if (definition) return res.status(200).json(definition);
      return res.status(404).json({
        message: `No cohort definition found with ID=${cohort_definition_id}`
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 3. Text Search in Cohort Definitions
 */
exports.search = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { query } = req.body;

  cohortDefinitionService
    .search(query, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No matching cohort definitions found." });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
