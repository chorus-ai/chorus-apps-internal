const permissionService = require('../../services/cbw/permission');

exports.findAll = async (req, res) => {
  try {
    const permissions = await permissionService.findAll();
    res.send(permissions);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.findByUserId = async (req, res) => {
  const uid = req.params.uid;

  try {
    const permissions = await permissionService.findByUserId(uid);
    res.send(permissions);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

exports.create = async (req, res) => {
  const permission = req.body;

  try {
    const createdPermission = await permissionService.create(permission);
    res.send(createdPermission);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.delete = async (req, res) => {
  const pid = req.params.uid;

  try {
    const deletedPermission = await permissionService.delete(pid);
    res.send(deletedPermission);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}