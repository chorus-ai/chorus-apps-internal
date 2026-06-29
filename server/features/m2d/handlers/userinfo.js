const userinfoService = require("../services/userinfo");

exports.findUserWithProjectsAndModelsById = (req, res) => {
  const { uid } = req.params;

  userinfoService
    .findUserWithProjectsAndModelsbyId(uid)
    .then((result) => {
      console.log(result)
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};