const cbwphaseService = require('../../services/cbw/phase');

exports.findAll = async (req, res) => {
  try {
    const phases = await cbwphaseService.findAll();
    if (!phases || phases?.length === 0) {
      return res.status(404).send({
        message: "No phase found",
      });
    }
    res.send(phases);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.findByOrder = async (req, res) => {
  const order = req.params.order;

  try {
    const phase = await cbwphaseService.findByOrder(order);
    if (!phase) {
      return res.status(404).send({
        message: "No phase found",
      });
    }
    res.send(phase);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.findByUserProgress = async (req, res) => {
  const uid = req.params.uid;
  try {
    const phases = await cbwphaseService.findUserProgress(uid);
    if (!phases || phases?.length === 0) {
      const phase = await cbwphaseService.findByOrder(1);
      if (!phase)
        return res.status(404).send({
          message: "No phase found",
        });
      console.log(phase.dataValues.id)
      await cbwphaseService.createUserProgress(uid, phase.dataValues.id);
      return res.send([phase.dataValues]);
    }
    res.send(phases);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.create = async (req, res) => {
  const { phase } = req.body;

  try {
    const createdPhase = await cbwphaseService.create(phase);
    res.send(createdPhase);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.createUserProgress = async (req, res) => {
  const { uid } = req.params;

  try {
    const phases = await cbwphaseService.findUserProgress(uid);
    let lastPhaseOrder = 0;
    if (phases && phases?.length !== 0) {
      lastPhaseOrder = phases[0].order;
    }
    const newPhase = await cbwphaseService.findByOrder(lastPhaseOrder + 1);
    await cbwphaseService.createUserProgress(uid, newPhase.id);
    const newUserProgress = await cbwphaseService.findUserProgress(uid);
    res.send(newUserProgress);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

exports.delete = async (req, res) => {
  const pid = req.params.pid;

  try {
    const deletedPhase = await cbwphaseService.delete(pid);
    res.send(deletedPhase);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.update = async (req, res) => {
  const { pid, phase } = req.body;

  try {
    const updatedPhase = await cbwphaseService.update(pid, phase);
    res.send(updatedPhase);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};