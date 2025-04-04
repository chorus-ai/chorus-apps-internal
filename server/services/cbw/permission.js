const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} uid 
 * @returns all permissions of the given user
 */
exports.findByUserId = (uid) => {
  return db.cbwPermission.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id"],
        through: {
          attributes: [],
        },
        required: true,
        where: {
          id: uid
        }
      }
    ],
  });
};

/**
 * 
 * @returns all permissions
 */
exports.findAll = () => {
  return db.cbwPermission.findAll();
};

/**
 * 
 * @param {Object} permission 
 * @returns created permission
 */
exports.create = (permission) => {
  return db.cbwPermission.create(permission);
};

/**
 * 
 * @param {Number} pid 
 * @returns deleted permission
 */
exports.delete = (pid) => {
  return db.cbwPermission.destroy({
    where: {
      id: pid
    }
  });
};

/**
 * 
 * @param {Number} pid 
 * @param {Object} permission 
 * @returns 
 */
exports.update = (pid, permission) => {
  return db.cbwPermission.update(permission, {
    where: {
      id: pid
    }
  });
};