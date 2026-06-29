const svc = require("../services/visit_detail");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "visit_detail",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "visit_detail",
    () => svc.findByPersonId(person_id, attrs, page, pageSize, sortOrder),
    () => svc.countByPersonId(person_id)
  );
};

exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "visit_detail",
    () => svc.findByVisitOccurrenceId(visit_occurrence_id, attrs, page, pageSize, sortOrder),
    () => svc.countByVisitOccurrenceId(visit_occurrence_id)
  );
};

exports.advancedSearch = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "visit_detail",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};
