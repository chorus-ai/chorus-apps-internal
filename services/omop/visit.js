const db = require("../../models");
const sequelize = require("sequelize");
const { Op } = sequelize;

const DEFAULT_SORT_ORDER = [["person_id", "ASC"]];
const ORDERS = ["ASC", "DESC"];
const DEFAULT_LIMIT = 1000;

const valid_page = (page, pageSize) => {
  return page && page >= 1 && pageSize && pageSize >= 1;
};

/**
 * 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {String} sortOrder 
 * @returns all all visit details
 */
exports.findAllDetail = (page, pageSize, sortOrder) => {
  return db.visit_detail.findAll({
    order: ORDERS.includes(sortOrder) ? [["visit_detail_id", sortOrder]] : DEFAULT_SORT_ORDER,
    offset: valid_page(page, pageSize) ? (page - 1) * pageSize : 0,
    limit: valid_page(page, pageSize) ? pageSize : DEFAULT_LIMIT,
    include: [
      {
        model: db.concept,
        required: true,
      }
    ]
  });
};

/**
 * 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {String} sortOrder 
 * @returns all visit occurrences
 */
exports.findAllOccurrence = (page, pageSize, sortOrder) => {
  return db.visit_occurrence.findAll({
    order: ORDERS.includes(sortOrder) ? [["visit_occurrence_id", sortOrder]] : DEFAULT_SORT_ORDER,
    offset: valid_page(page, pageSize) ? (page - 1) * pageSize : 0,
    limit: valid_page(page, pageSize) ? pageSize : DEFAULT_LIMIT,
    include: [
      {
        model: db.concept,
        required: true,
      }
    ]
  });
};