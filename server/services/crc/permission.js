const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} userId 
 * @returns all permissions belong to a user
 */
exports.findByUserId = (userId) => {
  return db.crcPermission.findAll({
    where: {
      userId: userId
    }
  });
};

exports.create = (type, userId) => {
  return db.crcPermission.create({
    type,
    userId
  });
}


exports.remove = (id) => {
  return db.crcPermission.destroy({
    where: {
      id: id
    }
  });
}

exports.removeByType = (type, uid) => {
  return db.crcPermission.destroy({
    where: {
      type: type,
      userId: uid
    }
  });
};


exports.update = (id, body) => {
  return db.crcPermission.update(body, {
    where: {
      id,
    }
  });
}

exports.bulkCreate = (permissions) => {
  return db.crcPermission.bulkCreate(permissions);
}