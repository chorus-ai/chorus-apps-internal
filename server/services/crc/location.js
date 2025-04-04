const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} uid 
 * @returns All locations of the given user
 */
exports.findAllByUserId = (uid) => {
  return db.crcLocation.findAll({
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
 * @param {Object} location 
 * @param {Number} uid 
 * @returns 
 */
exports.create = (location, uid) => {
  return db.crcLocation.create({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy,
    altitude: location.coords.altitude,
    altitudeAccuracy: location.coords.altitudeAccuracy,
    heading: location.coords.heading,
    speed: location.coords.speed,
    userId: uid,
    timestamp: location.timestamp,
  });
};


/**
 * 
 * @param {Array<Object>} locations 
 * @param {Number} uid 
 * @returns 
 */
exports.bulkCreate = (locations, uid) => {
  return db.crcLocation.bulkCreate(
    locations.map(location => ({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      altitude: location.coords.altitude,
      altitudeAccuracy: location.coords.altitudeAccuracy,
      heading: location.coords.heading,
      speed: location.coords.speed,
      userId: uid,
      timestamp: location.timestamp,
    }))
  );
}