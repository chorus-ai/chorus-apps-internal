const process = require("./process");
const { createQueue } = require("../../../utils/queue");

module.exports = {
  name: "myqueue",
  process,
  queue: createQueue("myqueue"),
};
