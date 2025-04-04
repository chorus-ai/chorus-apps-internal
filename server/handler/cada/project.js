const cadaProjectServices = require("../../services/cada/project");

exports.findAll = (req, res) => {
  cadaProjectServices
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

exports.create = (req, res) => {
  const {
    name,
    title,
    description,
    goal,
    data,
    info,
    attributes,
    projectType,
  } = req.body;

  cadaProjectServices.create(
    name,
    title,
    description,
    goal,
    data,
    info,
    attributes,
    projectType
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.createProjectForm = async (req, res) => {
  const { pid, fid } = req.params;

  await cadaProjectServices.createProjectForm(pid, fid);

  res.send({ message: "Created successfully" });
};


exports.findById = (req, res) => {
  const { pid } = req.params;

  cadaProjectServices
    .findById(pid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.update = (req, res) => {
  const { pid } = req.params;
  const body = req.body;

  cadaProjectServices
    .update(pid, body)
    .then((success) => {
      success == 1
        ? res.send({ message: "Updated successfully" })
        : res.send({ message: `Cannot update with id=${pid}!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.delete = (req, res) => {
  const { pid } = req.params;

  cadaProjectServices
    .delete(pid)
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

exports.findAllProjectUserRole = (req, res) => {
  cadaProjectServices
    .findAllProjectUserRole()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findProjectUserRolesByUserId = (req, res) => {
  const { uid } = req.params;

  cadaProjectServices
    .findProjectUserRolesByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findProjectUserRolesByProjectId = (req, res) => {
  const { pid } = req.params;

  cadaProjectServices
    .findProjectUserRolesByProjectId(pid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.createProjectUserRole = (req, res) => {
  const { pid, uid } = req.params;
  const { role } = req.query;

  cadaProjectServices
    .createProjectUserRole(pid, uid, role)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findProjectUserRole = (req, res) => {
  const { pid, uid } = req.params;

  cadaProjectServices
    .findProjectUserRole(pid, uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.updateProjectUserRole = (req, res) => {
  const { pid, uid } = req.params;
  const { role } = req.query;

  cadaProjectServices
    .updateProjectUserRole(pid, uid, role)
    .then((success) => {
      success == 1
        ? res.send({ message: "Updated successfully" })
        : res.send({ message: "Cannot update" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.deleteProjectUserRole = (req, res) => {
  const { pid, uid } = req.params;
  const { role } = req.query;

  cadaProjectServices
    .deleteProjectUserRole(pid, uid, role)
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
