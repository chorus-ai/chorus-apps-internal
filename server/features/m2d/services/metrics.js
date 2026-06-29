const db = require("../../../models");
const { Op } = require("sequelize");

/**
 *
 * @param {Number} rid
 * @returns all metrics of the given result
 */
exports.findAllByResultId = (rid) => {
  return db.m2dMetrics.findAll({
    where: {
      m2dResultId: parseInt(rid),
    },
  });
};

/**
 *
 * @param {Array<Object>} data
 * @returns all created metrics
 */
exports.bulkCreate = (data) => {
  return db.m2dMetrics.bulkCreate(data);
};
