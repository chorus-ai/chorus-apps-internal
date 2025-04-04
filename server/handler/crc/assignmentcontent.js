const crcassignmentcontentService = require("../../services/crc/assignmentcontent");


exports.findByContentId = (req, res) => {
  const { aid } = req.params;

  crcassignmentcontentService
    .findByContentId(aid)
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
  const { title, content, aid } = req.body;

  crcassignmentcontentService
    .update(title, content, aid)
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
  const { title, content, aid } = req.body;

  crcassignmentcontentService
    .create(title, content, aid)
    .then(result => {
      res.send({ message: "Successfully created!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.createUserAssignmentContent = (req, res) => {
  const { acid, uid, value, details=null } = req.body;

  crcassignmentcontentService
    .createUserAssignmentContent(uid, acid, value, details)
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
  const { aid } = req.params;
  
  crcassignmentcontentService
    .destroy(aid)
    .then(result => {
      res.send({ message: "Successfully removed!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.removeUserAssignmentContent = (req, res) => {
  const { acid, uid } = req.body;

  crcassignmentcontentService
    .destroyUserAssignmentContent(uid, acid)
    .then(result => {
      res.send({ message: "Successfully removed!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}