const svc = require("../services/measurement");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "measurement",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.search = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "measurement",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};
