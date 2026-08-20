const svc = require("../services/note");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "note",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.search = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "note",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};
