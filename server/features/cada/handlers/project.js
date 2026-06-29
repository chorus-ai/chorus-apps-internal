const cadaProjectServices = require("../services/project");

const toInt = (val, def) => {
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? def : n;
};

exports.findAll = (req, res) => {
  const page = toInt(req.query.page, 1);
  const pageSize = toInt(req.query.pageSize, 100);

  cadaProjectServices
    .findAll(page, pageSize)
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

  cadaProjectServices
    .create(name, title, description, goal, data, info, attributes, projectType)
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
  const { pid } = req.params;
  const page = toInt(req.query.page, 1);
  const pageSize = toInt(req.query.pageSize, 100);

  cadaProjectServices
    .findAllProjectUserRole(pid, page, pageSize)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

/** GET /cada/project/users/:uid */
exports.findProjectUserRolesByUserId = (req, res) => {
  const { uid } = req.params;
  const page     = toInt(req.query.page,     1);
  const pageSize = toInt(req.query.pageSize, 100);

  cadaProjectServices
    .findProjectUserRolesByUserId(uid, page, pageSize)
    .then(result => res.send(result))
    .catch(err => res.status(500).send({ message: err.message }));
};

/** GET /cada/project/:pid/users */
exports.findProjectUserRolesByProjectId = (req, res) => {
  const { pid } = req.params;
  const page     = toInt(req.query.page,     1);
  const pageSize = toInt(req.query.pageSize, 100);

  cadaProjectServices
    .findProjectUserRolesByProjectId(pid, page, pageSize)
    .then(result => res.send(result))
    .catch(err => res.status(500).send({ message: err.message }));
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

/** GET /cada/project/users/:uid/count */
exports.countProjectUserRolesByUserId = (req, res) => {
  const { uid } = req.params;
  cadaProjectServices
    .countProjectsByUser(uid)
    .then(count => res.send({ count }))
    .catch(err => res.status(500).send({ message: err.message }));
};



/** GET /cada/project/:pid/users/count */
exports.countProjectUserRolesByProjectId = (req, res) => {
  const { pid } = req.params;
  cadaProjectServices
    .countUsersInProject(pid)
    .then(count => res.send({ count }))
    .catch(err => res.status(500).send({ message: err.message }));
};

/** GET /cada/project/count */
exports.countAllProjects = (req, res) => {
  cadaProjectServices
    .countAllProjects()
    .then(count => res.send({ count }))
    .catch(err => res.status(500).send({ message: err.message }));
};