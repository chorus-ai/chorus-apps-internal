const featureService = require("../../services/feature");
const userService = require("../../services/user");
const m2dprojectService = require("../../services/m2d/project");
const m2dmodelService = require("../../services/m2d/model");

exports.findAllM2dUsers = async (req, res) => {
  const { adminId } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);

    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    const users = await userService.findAll(2, [], "", [adminId], "");

    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.editUser = async (req, res) => {
  const { adminId, uid, username, firstName, lastName, role, status } = req.body;

  try {
    const result = await featureService.findFeatureUserRole(2, adminId);

    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    await userService.update(uid, {
      firstName: firstName,
      lastName: lastName,
      username: username
    });

    await featureService.updateFeatureUserRole(2, uid, {
      role: role,
      status: status,
    });

    res.send({ success: "updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.searchUser = async (req, res) => {
  const { adminId, email } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);

    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    const users = await userService.findAll(2, [], "", [adminId], "");

    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.findAllPendingProjects = async (req, res) => {
  const { adminId } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);

    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    const projects = await m2dprojectService.findAllPending();

    res.send(projects);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.approveProject = async (req, res) => {
  const { adminId, pid } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);

    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    await m2dprojectService.approve(pid);

    res.send("Successfully approved!");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.rejectProject = async (req, res) => {
  const { adminId, pid, rejectReason } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);

    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    await m2dprojectService.reject(pid, adminId, rejectReason);

    res.send("Successfully approved!");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.searchProject = async (req, res) => {
  const { adminId, name } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);

    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    const projects = await m2dprojectService.findByNameOrTitle(name);
    res.send(projects);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findAllPendingModels = async (req, res) => {
  const { adminId } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);

    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    const models = await m2dmodelService.findAllPending();

    res.send(models);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.approveModel = async (req, res) => {
  const { adminId, mid } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);
    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    await m2dmodelService.approve(mid);

    res.send("Successfully approved!");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.rejectModel = async (req, res) => {
  const { adminId, mid, rejectReason } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);
    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    await m2dmodelService.reject(mid, rejectReason, adminId);

    res.send("Successfully approved!");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createUser = async (req, res) => {
  const { adminId, email, firstName, lastName, username, role } = req.body;
  try {
    const result = await featureService.findFeatureUserRole(2, adminId);
    if (!result && result.dataValues.role !== "Admin") {
      return res.send({ message: "User is not admin" });
    }

    let user = await userService.findByUsername(username);

    if (!user) {
      user = await userService.create(username, email, null, firstName, lastName, 'local', 0);
    }

    await featureService.createFeatureUserRole(
      2,
      user.dataValues.id,
      role,
      "Active"
    );

    res.send("Successfully added!");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
