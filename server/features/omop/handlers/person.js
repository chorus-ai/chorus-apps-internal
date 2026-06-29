const svc = require("../services/person");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "person",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.search = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "person",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};

exports.findById = (req, res) => {
  const { pid } = req.params;
  svc.findById(pid)
    .then((result) => {
      if (result) return res.status(200).json(result);
      return res.status(404).json({ message: "Not found." });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
