const svc = require("../services/drug_exposure");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "drug_exposure",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.search = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "drug_exposure",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};
