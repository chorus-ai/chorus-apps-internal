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
 * @returns all drug exposures
 */
exports.findAllDrugs = (page, pageSize, sortOrder) => {
  return db.drug_exposure.findAll({
    order: ORDERS.includes(sortOrder) ? [["drug_exposure_id", sortOrder]] : DEFAULT_SORT_ORDER,
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
 * @returns all device exposure
 */
exports.findAllDevices = (page, pageSize, sortOrder) => {
  return db.device_exposure.findAll({
    order: ORDERS.includes(sortOrder) ? [["device_exposure_id", sortOrder]] : DEFAULT_SORT_ORDER,
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