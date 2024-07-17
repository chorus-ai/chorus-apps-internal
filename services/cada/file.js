const db = require("../../models");
const { Op } = require("sequelize");

/**
 *
 * @param {String} searchString select files matching optional search stirng
 * @returns all files with optional search string
 */
//  all Files,
exports.findAll = (searchString) => {
  let searchFilter =
    searchString !== null && typeof searchString !== "undefined"
      ? {
          where: {
            path: {
              [Op.like]: searchString + "%",
            },
          },
        }
      : {};
  return db.cadaFile.findAll(searchFilter);
};

/**
 *
 * @param {Object} t transaction
 * @param {Array<Number>} files filenames
 * @returns all match files of the given filenames
 */
exports.bulkCreate = (t, files) => {
  return db.cadaFile.bulkCreate(files, { transaction: t });
};

/**
 *
 * @param {Object} t transaction
 * @param {Array<Number>} files filenames
 * @returns all match files of the given filenames
 */
exports.findByFiles = (t, files) => {
  return db.cadaFile.findAll({
    where: {
      path: { [Op.in]: files },
    },
    attributes: ["id", "path"],
    transaction: t,
  });
};
