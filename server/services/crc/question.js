const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} mid 
 * @returns get all self-reflection questions of the given module
 */
exports.findByModuleId = (mid) => {
  return db.crcQuestion.findAll({
    attributes: ['id', 'question', 'index'],
    order: [['index', 'ASC']],
    where: {
      crcModuleId: mid
    }
  })
}

/**
 * Remove questions
 * @param {Number} mid 
 * @returns 
 */
exports.destroyAll = (mid) => {
  return db.crcQuestion.destroy({
    where: {
      crcModuleId: mid,
    }
  });
};

/**
 * Create questions
 * @param {List<Object>} contents 
 * @returns 
 */
exports.bulkCreate = (contents) => {
  return db.crcQuestion.bulkCreate(contents);
};

/**
 * Create a module content
 * @param {String} question 
 * @param {Number} index 
 * @param {Number} mid 
 * @returns 
 */
exports.create = (question, index, mid) => {
  return db.crcQuestion.create({
    question,
    index,
    crcModuleId: mid,
  });
};

/**
 * Update content
 * @param {Number} id 
 * @param {String} question 
 * @returns 
 */
exports.updateContent = (id, question) => {
  return db.crcQuestion.update({
    question: question,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * Update a content's index
 * @param {Number} id 
 * @param {Number} index 
 * @returns 
 */
exports.updateOrder = (id, index) => {
  return db.crcQuestion.update({
    index: index,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * destroy a question
 * @param {Number} id 
 * @returns 
 */
exports.destroy = (id) => {
  return db.crcQuestion.destroy({
    where: {
      id: id,
    }
  });
};