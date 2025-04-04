const cbwactivityService = require('../../services/cbw/activity');

exports.findByPhaseId = async (req, res) => {
  const { pid } = req.params;
  try {
    const activities = await cbwactivityService.findByPhaseId(pid);
    if (!activities || activities?.length === 0) {
      return res.status(404).send({
        message: "No activity found",
      });
    }
    res.send(activities);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.create = async (req, res) => {
  const { activity } = req.body;
  try {
    const newActivity = await cbwactivityService.create(activity);
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
    const newContent = await cbwactivityService.createContent(content);
    res.send(newContent);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

exports.update = async (req, res) => {
  const { aid } = req.params;
  const { activity } = req.body;
  try {
    const updatedActivity = await cbwactivityService.update(aid, activity);
    res.send(updatedActivity);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  const { activities } = req.body;
  console.log(activities);
  try {
    for (let i = 0; i < activities.length; i++) {
      await cbwactivityService.update(activities[i].id, { order: activities[i].order });
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
    const updatedContent = await cbwactivityService.updateContent(cid, content);
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
      await cbwactivityService.updateContent(contents[i].id, { order: contents[i].order });
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
  const { aid } = req.params;
  try {
    await cbwactivityService.delete(aid);
    res.send({
      message: "Activity deleted successfully",
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
    await cbwactivityService.deleteContent(cid);
    res.send({
      message: "Content deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};