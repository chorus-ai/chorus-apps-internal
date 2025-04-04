const cbwdietService = require('../../services/cbw/diet');

exports.findByPhaseId = async (req, res) => {
  const { pid } = req.params;
  try {
    const diets = await cbwdietService.findByPhaseId(pid);
    if (!diets || diets?.length === 0) {
      return res.status(404).send({
        message: "No diet found",
      });
    }
    res.send(diets);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.create = async (req, res) => {
  const { diet } = req.body;
  try {
    const newActivity = await cbwdietService.create(diet);
    res.send(newActivity);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.createContent = async (req, res) => {
  const { content } = req.body;
  try {
    const newContent = await cbwdietService.createContent(content);
    res.send(newContent);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

exports.update = async (req, res) => {
  const { did } = req.params;
  const { diet } = req.body;
  try {
    const updatedDiet = await cbwdietService.update(did, diet);
    res.send(updatedDiet);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  const { diets } = req.body;
  try {
    for (let i = 0; i < diets.length; i++) {
      await cbwdietService.update(diets[i].id, { order: diets[i].order });
    }
    res.send({
      message: "Order updated successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

};

exports.updateContent = async (req, res) => {
  const { cid } = req.params;
  const { content } = req.body;
  try {
    const updatedContent = await cbwdietService.updateContent(cid, content);
    res.send(updatedContent);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.updateContentOrder = async (req, res) => {
  const { contents } = req.body;
  try {
    for (let i = 0; i < contents.length; i++) {
      await cbwdietService.updateContent(contents[i].id, { order: contents[i].order });
    }
    res.send({
      message: "Order updated successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

};

exports.delete = async (req, res) => {
  const { did } = req.params;
  try {
    await cbwdietService.delete(did);
    res.send({
      message: "Diet deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.deleteContent = async (req, res) => {
  const { cid } = req.params;
  try {
    await cbwdietService.deleteContent(cid);
    res.send({
      message: "Content deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};