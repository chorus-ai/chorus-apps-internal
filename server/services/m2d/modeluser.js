const db = require("../../models");

/**
 *
 * @param {Number} mid
 * @param {Number} uid
 * @returns created modeluser
 */
exports.create = (mid, uid) => {
  return db.m2dModelUser.create({
    m2dModelId: mid,
    userId: uid,
  });
};

/**
 *
 * @param {Number} mid
 * @returns remove model with given id
 */
exports.destroy = (mid) => {
  return db.m2dModelUser.destroy({
    where: {
      m2dModelId: mid,
    },
  });
};

/**
 *
 * @param {Array<Number>} uids
 * @param {Number} mid
 * @returns all created modelusers
 */
exports.bulkCreate = (uids, mid) => {
  const users = uids.map((uid) => {
    return { m2dModelId: mid, userId: uid };
  });

  return db.m2dModelUser.bulkCreate(users);
};
