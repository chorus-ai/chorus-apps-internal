const svc = require("../services/observation_period");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "observation_period",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "observation_period",
    () => svc.findByPersonId(person_id, attrs, page, pageSize, sortOrder),
    () => svc.countByPersonId(person_id)
  );
};

exports.advancedSearch = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "observation_period",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};
