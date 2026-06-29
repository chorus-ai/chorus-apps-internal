const svc = require("../services/cohort");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "cohort",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.findByCohortDefinitionId = (req, res) => {
  const { cohort_definition_id } = req.params;
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "cohort",
    () => svc.findByCohortDefinitionId(cohort_definition_id, attrs, page, pageSize, sortOrder),
    () => svc.countByCohortDefinitionId(cohort_definition_id)
  );
};

exports.advancedSearch = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "cohort",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};
