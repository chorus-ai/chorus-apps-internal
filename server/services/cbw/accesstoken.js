const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

/**
 * 
 * @param {Number} uid 
 * @returns The latest fitbit access token
 */
exports.findbyUserId = (uid) => {
  return db.cbwFitbitUser.findAll({
    order: [['createdAt', 'DESC']],
    limit: 1,
    where: {
      userId: uid,
    }
  });
};

/**
 * 
 * @param {String} token 
 * @param {Number} uid 
 * @returns created token
 */
exports.create = (token, uid) => {
  return db.cbwFitbitUser.create({ token, userId: uid });
};