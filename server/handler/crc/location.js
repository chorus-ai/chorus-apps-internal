const crclocationService = require('../../services/crc/location');

exports.findAllByUserId = (req, res) => {
  const { uid } = req.params;
  crclocationService
    .findAllByUserId(uid)
    .then(locations => {
      res.send(locations);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = (req, res) => {
  const { location, uid } = req.body;
  crclocationService
    .create(location, uid)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.bulkCreate = (req, res) => {
  const { locations, uid } = req.body;
  crclocationService
    .bulkCreate(locations, uid)
    .then(result => {
      res.send({ message: 'Successfully updated!' });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message,
      });
    });
};