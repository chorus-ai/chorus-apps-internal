const userService = require("../../services/user");
const featureService = require("../../services/feature");

exports.updateUser = async (req, res) => {
  const { uid, email, firstName, lastName, role, status } = req.body;

  try {
    await userService
      .update(uid, {
        username: email,
        email,
        firstName,
        lastName
      });

    await featureService
      .updateFeatureUserRole(3, uid, {
        role,
        status
      });
    
      res.send({message: "Successfully updated"});

  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

}