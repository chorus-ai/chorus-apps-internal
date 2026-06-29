const svc = require("../services/drug_exposure");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "drug_exposure",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "drug_exposure",
    () => svc.findByPersonId(person_id, attrs, page, pageSize, sortOrder),
    () => svc.countByPersonId(person_id)
  );
};

exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "drug_exposure",
    () => svc.findByVisitOccurrenceId(visit_occurrence_id, attrs, page, pageSize, sortOrder),
    () => svc.countByVisitOccurrenceId(visit_occurrence_id)
  );
};

exports.advancedSearch = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "drug_exposure",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};
