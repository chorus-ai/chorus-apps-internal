const db = require("../../models");
const { Op } = require("sequelize");


/**
 * Find a module's quizes
 * @param {Number} mid 
 * @returns {List<Object>} all quizes under a module
 */
exports.findByModuleId = (mid) => {
  return db.crcMultipleChoice.findAll({
    order: [['index', 'ASC']],
    where: {
      crcModuleId: mid
    }
  });
};

/**
 * Create a quiz
 * @param {String} question 
 * @param {String} A 
 * @param {String} B 
 * @param {String} C 
 * @param {String} D 
 * @param {String} answer 
 * @param {Number} index 
 * @param {Number} mid 
 * @returns created quiz
 */
exports.create = (question, A, B, C, D, answer, explanation, index, mid) => {
  return db.crcMultipleChoice.create({
    question,
    A,
    B,
    C,
    D,
    answer,
    explanation,
    index,
    crcModuleId: mid,
  });
};

/**
 * Bulket create quizes
 * @param {List<Object>} quizes 
 * @returns created quizes
 */
exports.bulkCreate = (quizes) => {
  return db.crcMultipleChoice.bulkCreate(quizes);
};

/**
 * destroy quizes
 * @param {Number} id 
 * @returns 
 */
exports.remove = (id) => {
  return db.crcMultipleChoice.destroy({
    where: {
      id
    }
  });
};

/**
 * remove all quizes of a module
 * @param {Number} mid 
 * @returns 
 */
exports.removeAll = (mid) => {
  return db.crcMultipleChoice.destroy({
    where: {
      crcModuleId: mid,
    }
  });
};

/**
 * 
 * @param {Number} id 
 * @param {Object} body
 * @returns 
 */
exports.update = (id, body) => {
  return db.crcMultipleChoice.update(body, {
    where: {
      id,
    }
  });
};

/**
 * record user's score of a module quiz
 * @param {Number} mid 
 * @param {Number} uid 
 * @param {Number} score 
 * @returns 
 */
exports.recordScore = (mid, uid, score) => {
  return db.crcQuizUser.create({
    score,
    crcModuleId: mid,
    userId: uid,
  });
};