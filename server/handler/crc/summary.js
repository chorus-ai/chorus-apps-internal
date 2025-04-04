const crcsummaryService = require("../../services/crc/summary");

exports.findByModuleId = (req, res) => {
  const { mid } = req.params;
  crcsummaryService
    .findByModuleId(mid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.update = async (req, res) => {
  const { mid, contents } = req.body;
  const newData = JSON.parse(contents).map(item => {
    return {
      summary: item.summary,
      index: item.index,
      crcModuleId: mid,
    }
  });

  try {
    await crcsummaryService.destroyAll(mid);
    const newSummaries = await crcsummaryService.bulkCreate(newData);
    res.send(newSummaries);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}