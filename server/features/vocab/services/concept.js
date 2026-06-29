const db = require("../../../models");
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
exports.findAll = (table, column, page, pageSize, sortOrder) => {
  const {order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
   
  const where = {};
  
  if (table) {
    where.table_name = String(table);
  }

  if (column) {
    where.column_name = String(column);
  }

  return db.concept.findAll({
    where,
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
 * @param {String} table - The table to filter concepts by.
 * @param {Number} page - The current page number.
 * @param {Number} pageSize - Number of items per page.
 * @param {Boolean} exactMatch - Whether to match terms exactly.
 * @returns {Promise} - A promise that resolves with the concepts of the current page.
 */
exports.searchByName = (name, table, column, page, pageSize, exactMatch = false, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  if (typeof name !== "string") {
    throw new TypeError("Name must be a string");
  }

  if (name.trim() === "") {
    throw new Error("Name cannot be empty");
  }

  const searchString = name.trim();

  const where = {};

  if (exactMatch) {
    where.concept_name = searchString;
  } else {
    where.concept_name = {
      [Op.like]: `%${searchString}%`, 
    };
  }

  if (table) {
    where.table_name = String(table);
  }

  if (column) {
    where.column_name = String(column);
  }

  return db.concept.findAll({
    where,
    order,
    offset,
    limit,
  });
};

