const db = require("../../models");
const { Op } = require("sequelize");


/**
 * Find all stars of a model
 * @param {Number} mid 
 * @returns {List<Object>} all users that stared the model
 */
exports.findByModelId = (mid) => {
  return db.m2dModelStar.findAll({
    attributes: ["id", "m2dModelId", "userId", "createdAt"],
    where: {
      m2dModelId: mid,
    }
  });
};

/**
 * Find all stars of a user
 * @param {Number} uid 
 * @returns {List<Object>} all models that the user stared
 */
exports.findByUserId = (uid) => {
  return db.m2dModelStar.findAll({
    attributes: ["id", "m2dModelId", "userId", "createdAt"],
    where: {
      userId: uid,
    }
  });
};

/**
 * Find if a user stared a model
 * @param {Number} uid 
 * @param {Number} mid 
 * @returns {Object} m2dModelStar if the user stared the model
 */
exports.findStarStatus = (uid, mid) => {
  return db.m2dModelStar.findOne({
    attributes: ["id", "m2dModelId", "userId", "createdAt"],
    where: {
      userId: uid,
      m2dModelId: mid
    }
  })
}

/**
 * Create a model star
 * @param {Number} uid 
 * @param {Number} mid 
 */
exports.create = (uid, mid) => {
  return db.m2dModelStar.create({
    m2dModelId: mid,
    userId: uid
  });
};

/**
 * Remove a star
 * @param {Number} uid 
 * @param {Number} mid 
 */
exports.remove = (uid, mid) => {
  return db.m2dModelStar.destroy({
    where: {
      m2dModelId: mid,
      userId: uid
    }
  })
}