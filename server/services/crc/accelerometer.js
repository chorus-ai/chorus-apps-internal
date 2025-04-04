const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} uid 
 * @returns All accelerometers of the given user
 */
exports.findAllByUserId = (uid) => {
  return db.crcAccelerometer.findAll({
    where: {
      userId: uid,
    },
    order: [
      ['timestamp', 'ASC']
    ]
  });
};

/**
 * 
 * @param {Object} acc 
 * @param {Number} uid 
 * @returns 
 */
exports.create = (acc, uid) => {
  return db.crcAccelerometer.create({
    x: acc.x,
    y: acc.y,
    z: acc.z,
    userId: uid,
    timestamp: acc.timestamp,
  });
};


/**
 * 
 * @param {Array<Object>} accs 
 * @param {Number} uid 
 * @returns 
 */
exports.bulkCreate = (accs, uid) => {
  return db.crcAccelerometer.bulkCreate(
    accs.map(acc => ({
      x: acc.x,
      y: acc.y,
      z: acc.z,
      userId: uid,
      timestamp: acc.timestamp,
    }))
  );
}