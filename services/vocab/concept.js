const db = require("../../models");
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { getPaginationAndSort } = require("./_helper");

/**
 * 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {Array<Array<String>>} sortOrder 
 * @returns all concepts
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.concept.findAll({
    order,
    offset,
    limit,
  });
};

/**
 * 
 * @param {Number} cid 
 * @returns the concept with the given id
 */
exports.findById = (cid) => {
  return db.concept.findByPk(cid);
};

/**
 *
 * @param {String} name - The search term.
 * @param {Number} page - The current page number.
 * @param {Number} pageSize - Number of items per page.
 * @param {Boolean} exactMatch - Whether to match terms exactly.
 * @returns {Promise} - A promise that resolves with the concepts of the current page.
 */
exports.searchByName = (name, page, pageSize, exactMatch = false) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }

  const searchString = name.toLowerCase().trim();

  const conditions = exactMatch ? { [Op.eq]: searchString } : { [Op.like]: `%${searchString}%` };

  return db.concept.findAll({
    where: { concept_name: conditions },
    order,
    offset,
    limit
  });
};

