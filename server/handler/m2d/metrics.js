const m2dmetricsService = require("../../services/m2d/metrics");

exports.findById = (req, res) => {
  const { rid } = req.params;
  m2dmetricsService
    .findAllByResultId(rid)
    .then((result) => {
      const savedMetrics = [];
      for (const r of result) {
        savedMetrics.push(r.dataValues.name);
      }
      res.send({ savedMetrics: savedMetrics });
    })
    .catch((err) => {
      res.sendStatus(500, {
        message: err.message,
      });
    });
};

exports.create = (req, res) => {
  const { uid, rid, checkedList, valueList } = req.body;
  if (checkedList.length !== valueList.length) {
    res.sendStatus(500, {
      message: "Unmatched array lengths!",
    });
  }

  const data = [];

  for (let i = 0; i < checkedList.length; i++) {
    data.push({
      m2dResultId: rid,
      name: checkedList[i],
      value: valueList[i],
      userId: uid,
      date: new Date(),
    });
  }

  m2dmetricsService
    .bulkCreate(data)
    .then(() => {
      res.send({ success: "ok" });
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500, {
        message: err.message,
      });
    });
};
