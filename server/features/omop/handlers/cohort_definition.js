const svc = require("../services/cohort_definition");
const { respondWithMode } = require("../services/_helper");

exports.findAll = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "cohort_definition",
    () => svc.findAll(attrs, page, pageSize, sortOrder),
    () => svc.countAll()
  );
};

exports.advancedSearch = (req, res) => {
  const { attrs, page, pageSize, sortOrder } = req.query;
  respondWithMode(res, req, "cohort_definition",
    () => svc.advancedSearch(req.body, attrs, page, pageSize, sortOrder),
    () => svc.countBySearch(req.body)
  );
};

exports.findById = (req, res) => {
  const { cohort_definition_id } = req.params;
  svc.findById(cohort_definition_id)
    .then((result) => {
      if (result) return res.status(200).json(result);
      return res.status(404).json({ message: "Not found." });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
