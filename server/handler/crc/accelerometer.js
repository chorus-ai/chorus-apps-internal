const crcaccelerometerService = require('../../services/crc/accelerometer');

exports.findAllByUserId = (req, res) => {
  const { uid } = req.params;
  crcaccelerometerService
    .findAllByUserId(uid)
    .then(accs => {
      res.send(accs);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = (req, res) => {
  const { acc, uid } = req.body;
  crcaccelerometerService
    .create(acc, uid)
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
  const { accs, uid } = req.body;
  crcaccelerometerService
    .bulkCreate(accs, uid)
    .then(result => {
      res.send({ message: 'Successfully updated!' });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message,
      });
    });
};