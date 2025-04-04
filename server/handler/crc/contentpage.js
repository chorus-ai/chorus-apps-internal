const crccontentpageService = require("../../services/crc/contentpage");


exports.findByContentId = (req, res) => {
  const { cid } = req.params;

  crccontentpageService
    .findByContentId(cid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.update = (req, res) => {
  const { title, content, cid } = req.body;

  crccontentpageService
    .update(title, content, cid)
    .then(result => {
      res.send({ message: "Successfully updated!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = (req, res) => {
  const { title, content, cid } = req.body;

  crccontentpageService
    .create(title, content, cid)
    .then(result => {
      res.send({ message: "Successfully created!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.remove = (req, res) => {
  const { cid } = req.params;
  
  crccontentpageService
    .destroy(cid)
    .then(result => {
      res.send({ message: "Successfully removed!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}