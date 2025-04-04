const omopPersonServices = require("../../services/omop/person");

exports.findById = (req, res) => {
  const { pid } = req.params;
  omopPersonServices
    .findById(pid)
    .then((result) => {
      if (result)
        return res.status(200).json(result)
      return res.status(404).send({ "message": "No person found." })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  omopPersonServices
    .findAll(page, pageSize, sortOrder)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findByConcept = (req, res) => {
  const { cid } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  omopPersonServices
    .findByConcept(cid, page, pageSize, sortOrder)
    .then((result) => {
      if (result)
        return res.status(200).json(result)
      return res.status(404).send({ "message": "No person found." })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findByIds = (req, res) => {
  const { pids } = req.body;
  const { page, pageSize, sortOrder } = req.query;

  omopPersonServices
    .findByIds(pids, page, pageSize, sortOrder)
    .then((result) => {
      if (result)
        return res.status(200).json(result)
      return res.status(404).send({ "message": "No person found." })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.search = (req, res) => {
  const {
    gender_concept_ids,
    race_concept_ids,
    ethnicity_concept_ids,
    start_birth_date,
    end_birth_date,
  } = req.body;

  const { page, pageSize, sortOrder } = req.query;

  omopPersonServices
    .search(
      gender_concept_ids,
      race_concept_ids,
      ethnicity_concept_ids,
      start_birth_date,
      end_birth_date,
      page,
      pageSize,
      sortOrder
    )
    .then((result) => {
      if (result && result.length > 0) {
        return res.status(200).json(result);
      }
      return res.status(404).json({ message: "No person found." });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};