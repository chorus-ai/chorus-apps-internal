const m2dprojectService = require("../../services/m2d/project");

exports.findAll = (req, res) => {
  m2dprojectService
    .findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findById = (req, res) => {
  const { uid, pid } = req.body;

  m2dprojectService
    .findById(pid)
    .then((result) => {
      if (result.dataValues.approveStatus === "Approved") {
        res.send(result);
      } else {
        const users = result.dataValues.users;
        if (users.find((user) => user.id === uid)) {
          res.send(result);
        } else {
          res.send("Access denied!");
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.getAllProjectNamesAndIdsByUserId = (req, res) => {
  const { uid } = req.body;

  m2dprojectService
    .getAllProjectNamesAndIdsByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = (req, res) => {
  const { uid, name, title, description, goal, models } = req.body;

  m2dprojectService
    .create(uid, name, title, description, goal, models)
    .then(() => {
      res.send({ status: "done" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findUnapprovedProjectsByUserId = (req, res) => {
  const { uid } = req.body;

  m2dprojectService
    .findUnapprovedProjectsByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.edit = (req, res) => {
  const { pid, name, title, description, goal, uids, mids } = req.body;

  m2dprojectService
    .edit(pid, name, title, description, goal, uids, mids)
    .then(() => {
      res.send("Successfully updated!");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.remove = async (req, res) => {
  const { pid, uid } = req.body;

  try {
    const allProjectUsers = await m2dprojectService.findProjectUsersByProjectId(
      pid
    );
    if (allProjectUsers.length === 1) {
      if (allProjectUsers[0].dataValues.userId !== uid) {
        res.status(500).send({
          message: "You don't have the permission to remove this project!",
        });
      } else {
        await m2dprojectService.remove(pid);
        res.send("Successfully removed!");
      }
    } else {
      if (!allProjectUsers.find((pu) => pu.dataValues.userId === uid)) {
        res.status(500).send({
          message: "You don't have the permission to remove this project!",
        });
      } else {
        await m2dprojectService.removeUserFromProject(uid, pid);
        res.send("Successfully removed!");
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
