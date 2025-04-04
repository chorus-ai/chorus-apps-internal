const cbwaccesstokenService = require("../../services/cbw/accesstoken");

exports.findByUserId = async (req, res) => {
  const { uid } = req.params;
  try {
    const accesstokens = await cbwaccesstokenService.findbyUserId(uid);
    if (!accesstokens || accesstokens?.length === 0) {
      return res.status(404).send({
        message: "No accesstoken found",
      });
    }
    res.send(accesstokens[0]);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.create = async (req, res) => {
  const { token, uid } = req.body;
  try {
    const newAccesstoken = await cbwaccesstokenService.create(token, uid);
    res.send(newAccesstoken);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}