const db = require("../../models");
const { Op } = require("sequelize");

/**
 * Create a format
 * @param {String} format 
 * @returns 
 */
exports.create = (format) => {
  return db.crcFormat.create({
    format: format
  });
};

/**
 * Edit a format
 * @param {Number} fid 
 * @param {String} newFormat 
 * @returns 
 */
exports.edit = (fid, newFormat) => {
  return db.crcFormat.update({
    format: newFormat,
  }, {
    where: {
      id: fid,
    }
  });
};

/**
 * Remove a format
 * @param {Number} fid 
 * @returns 
 */
exports.remove = (fid) => {
  return db.crcFormat.destory({
    where: {
      id: fid,
    }
  });
};