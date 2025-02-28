const db = require("../../models");
const Sequelize = require('sequelize');
const { Op } = Sequelize;


const DEFAULT_SORT_ORDER = [["concept_id", "ASC"]];
const DEFAULT_PAGE_SIZE = 1000;

/**
 * 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {Array<Array<String>>} sortOrder 
 * @returns all concepts
 */
exports.findAll = (page, pageSize, sortOrder) => {
  return db.concept.findAll({
    order: sortOrder || DEFAULT_SORT_ORDER,
    offset: page >= 1 ? (page - 1) * pageSize : 0,
    limit: pageSize > 0 && pageSize <= 1000 ? pageSize : DEFAULT_PAGE_SIZE,
  });
};

/**
 * 
 * @param {Number} cid 
 * @returns the concept with the given id
 */
exports.findById = (cid) => {
  return db.concept.findOne({
    where: {
      concept_id: cid
    }
  });
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
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }

  const searchString = name.toLowerCase().trim();

  const conditions = exactMatch ? { [Op.eq]: searchString } : { [Op.like]: `%${searchString}%` };

  return db.concept.findAll({
    offset: page >= 1 ? (page - 1) * pageSize : 0,
    limit: pageSize > 0 && pageSize <= 1000 ? pageSize : DEFAULT_PAGE_SIZE,
    where: { concept_name: conditions }
  });
};

