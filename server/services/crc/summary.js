const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} mid 
 * @returns summary of the module
 */
exports.findByModuleId = (mid) => {
  return db.crcSummary.findAll({
    attributes: ['id', 'summary', 'index'],
    where: {
      crcModuleId: mid
    },
    order: [['index', 'ASC']],
  })
}

/**
 * Remove summaries
 * @param {Number} ids 
 * @returns 
 */
exports.destroyAll = (mid) => {
  return db.crcSummary.destroy({
    where: {
      crcModuleId: mid,
    }
  });
};

/**
 * Create summaries
 * @param {List<Object>} contents 
 * @returns 
 */
exports.bulkCreate = (contents) => {
  return db.crcSummary.bulkCreate(contents);
};