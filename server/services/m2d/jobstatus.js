const db = require("../../models");
// const { Op } = require("sequelize");

/**
 *
 * @param {Number} resultId
 * @param {String} status
 * @returns created job status
 */
exports.create = (resultId, status = "Queuing") => {
  return db.m2dJobStatus.create({
    m2dResultId: resultId,
    status: status,
    time: new Date(),
  });
};
