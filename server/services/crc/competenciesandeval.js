const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} mid 
 * @returns get all competencies and evaluations of the given module
 */
exports.findByModuleId = (mid) => {
  return db.crcCompetenciesAndEval.findAll({
    attributes: ['id', 'content', 'index'],
    order: [['index', 'ASC']],
    where: {
      crcModuleId: mid
    }
  })
}

/**
 * Remove contents
 * @param {Number} mid 
 * @returns 
 */
exports.destroyAll = (mid) => {
  return db.crcCompetenciesAndEval.destroy({
    where: {
      crcModuleId: mid,
    }
  });
};

/**
 * Create contents
 * @param {List<Object>} contents 
 * @returns 
 */
exports.bulkCreate = (contents) => {
  return db.crcCompetenciesAndEval.bulkCreate(contents);
};

/**
 * Create an module evaluation
 * @param {String} content 
 * @param {Number} index 
 * @param {Number} mid 
 * @returns 
 */
exports.create = (content, index, mid) => {
  return db.crcCompetenciesAndEval.create({
    content,
    index,
    crcModuleId: mid,
  });
};

/**
 * Update evaluation
 * @param {Number} id 
 * @param {String} content 
 * @returns 
 */
exports.updateContent = (id, content) => {
  return db.crcCompetenciesAndEval.update({
    content: content,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * Update an evaluation's index
 * @param {Number} id 
 * @param {Number} index 
 * @returns 
 */
exports.updateOrder = (id, index) => {
  return db.crcCompetenciesAndEval.update({
    index: index,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * destroy an evaluation
 * @param {Number} id 
 * @returns 
 */
exports.destroy = (id) => {
  return db.crcCompetenciesAndEval.destroy({
    where: {
      id: id,
    }
  });
};