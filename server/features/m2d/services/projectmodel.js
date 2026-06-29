const db = require("../../../models");

/**
 *
 * @param {Number} pid
 * @param {Number} mid
 * @returns created projectmodel
 */
exports.create = (pid, mid) => {
  return db.m2dProjectModel.create({
    m2dProjectId: pid,
    m2dModelId: mid,
  });
};

/**
 * 
 * @param {Number} pid 
 * @param {Number} mid 
 * @returns update model project
 */
exports.update = (pid, mid) => {
  return db.m2dProjectModel.update({
    m2dProjectId: pid
  }, {
    where: {
      m2dModelId: mid
    }
  })
}