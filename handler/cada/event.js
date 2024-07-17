const userService = require("../../services/user");
const cadaEventServices = require("../../services/cada/event");
const cadaJobServices = require("../../services/cada/job");

exports.findAll = (req, res) => {
  let { pid, completed, page, pageSize, sortOrder, sinceId } = req.query;

  cadaEventServices
    .findAll(pid, completed, page, pageSize, sortOrder, sinceId)
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = (req, res) => {
  let { pid } = req.query;

  //remove duplicates from file ids
  let files = [...new Set(req.body)];

  cadaEventServices
    .create(pid, files)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.delete = (req, res) => {
  let { eid } = req.query;

  cadaEventServices
    .delete(eid)
    .then((success) => {
      success == 1
        ? res.send({ message: "Removed successfully" })
        : res.send({ message: "Nothing to delete" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.count = (req, res) => {
  let { pid, completed } = req.query;

  cadaEventServices
    .count(pid, completed)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAssignments = (req, res) => {
  let { pid, uid, completed, page, pageSize, sortOrder, sinceId } = req.query;

  cadaEventServices
    .findAssignments(pid, uid, completed, page, pageSize, sortOrder, sinceId)
    .then((assignments) => {
      res.send(assignments);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.createAssignments = (req, res) => {
  let { uid } = req.query;

  //remove duplicates from events
  let events = [...new Set(req.body)];

  userService
    .isBot(uid)
    .then((user) => {
      return cadaEventServices.createAssignments(uid, events).then((result) => {
        //if user is bot, do following
        if (user) {
          cadaJobServices.pushJobs(result);
        }
        return result;
      });
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.deleteAssignments = (req, res) => {
  let { uid } = req.query;

  //remove duplicates
  let annotations = [...new Set(req.body)];

  cadaEventServices
    .deleteAssignments(uid, annotations)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.countAssignments = (req, res) => {
  let { pid, uid } = req.query;

  cadaEventServices
    .countAssignments(pid, uid)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.createAnnotationValue = (req, res) => {
  let { field, value, cadaAnnotationId, createdAt } = req.body;

  cadaEventServices
    .updateAnnotationComplete(cadaAnnotationId, createdAt)
    .then((success) => {
      if (success == 1) {
        return cadaEventServices.createAnnotationValue(
          field,
          value,
          cadaAnnotationId,
          createdAt
        );
      } else {
        res.status(500).send({
          message: "Not updated",
        });
      }
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.createAdjudicationValue = (req, res) => {
  let { field, value, userId, cadaEventId, createdAt } = req.body;

  cadaEventServices
    .createAdjudicationValue(field, value, userId, cadaEventId, createdAt)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAnnotators = (req, res) => {
  const eIds = req.body;
  cadaEventServices
    .findAnnotators(eIds)
    .then((result) => {
      if (result) {
        return userService.findByIds(
          result.map((u) => u.get({ plain: true }).userId)
        );
      } else {
        res.status(404).send({
          message: "Not found",
        });
      }
    })
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAdjudicators = (req, res) => {
  const eIds = req.body;
  cadaEventServices
    .findAdjudicators(eIds)
    .then((result) => {
      if (result) {
        return userService.findByIds(
          result.map((u) => u.get({ plain: true }).userId)
        );
      } else {
        res.status(404).send({
          message: "Not found",
        });
      }
    })
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
