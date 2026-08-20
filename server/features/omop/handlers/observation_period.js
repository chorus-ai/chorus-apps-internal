const svc = require("../services/observation_period");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "observation_period",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.search = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "observation_period",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};
