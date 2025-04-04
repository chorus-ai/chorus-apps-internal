const crcmoduleService = require("../../services/crc/module");

exports.findByRole = (req, res) => {
  const { role, uid } = req.body;

  crcmoduleService
    .findByRole(role, uid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findById = (req, res) => {
  const { mid } = req.params;
  crcmoduleService
    .findById(mid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.setModuleProgress = (req, res) => {
  const { mid, uid, progress } = req.body;
  console.log(mid)
  crcmoduleService
    .setProgress(mid, uid, parseFloat(progress))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.editModuleName = (req, res) => {
  const { mid, moduleName } = req.body;
  crcmoduleService
    .editModuleName(mid, moduleName)
    .then(() => {
      res.send({ message: "Successfully updated!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.remove = (req, res) => {
  const { mid } = req.params;
  crcmoduleService
    .remove(mid)
    .then(() => {
      res.send({ message: "Successfully removed!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}