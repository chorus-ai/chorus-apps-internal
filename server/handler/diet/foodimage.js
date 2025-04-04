const foodimageService = require('../../services/diet/foodimage');

require("events").EventEmitter.defaultMaxListeners = 100;

exports.processFoodImage = async (req, res) => {
  const { files } = req;
  const { uid } = req.params;
  try {
    const fileBuffer = files[0].buffer;

    const base64Image = fileBuffer.toString("base64");

    const result = await foodimageService.processFoodImage(`data:image/jpeg;base64,${base64Image}`, uid);

    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};