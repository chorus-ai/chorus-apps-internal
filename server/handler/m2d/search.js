const m2dprojectService = require("../../services/m2d/project");
const m2dmodelService = require("../../services/m2d/model");

exports.search = async (req, res) => {
  let { title } = req.body;
  console.log(title);

  let searcharr = {};
  try {
    const projects = await m2dprojectService.findAllByName(title);
    searcharr["projects"] = projects;
  } catch (err) {
    console.error(err);
  }
  try {
    const models = await m2dmodelService.findAllByName(title);
    searcharr["models"] = models;
  } catch (err) {
    console.error(err);
  }

  res.send(searcharr);
};
