const crcformatService = require("../../services/crc/format");

exports.create = (req, res) => {
  const { format } = req.body;
  crcformatService
    .create(format)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.edit = (req, res) => {
  const { fid, newFormat } = req.body;
  crcformatService
    .edit(fid, newFormat)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.remove = (req, res) => {
  const { fid } = req.params;
  crcformatService
    .remove(fid)
    .then(() => {
      res.send({message: 'Successfully removed!'});
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}