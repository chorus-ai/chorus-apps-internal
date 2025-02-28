// services/omop/death.js
const db = require("../../models");
const sequelize = require("sequelize");
const { Op } = sequelize;

const ORDERS = ["ASC", "DESC"];
const DEFAULT_SORT = [["person_id", "DESC"]];
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 1000;

/**
 * Helper: parse page, pageSize, sortOrder
 */
function getPaginationAndSort(page, pageSize, sortOrder) {
  const pageNum = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

  const order = ORDERS.includes((sortOrder || "").toUpperCase())
    ? [["person_id", sortOrder]]
    : DEFAULT_SORT;

  const limit = size > 0 && size <= MAX_PAGE_SIZE ? size : DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limit;

  return { order, offset, limit };
}

/**
 * 1. List All Death Records
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.death.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Death Record by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.death.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Death Records by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.death.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 4. Search for Death Records by Various Attributes
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const {
    person_id,
    death_date,
    death_type_concept_id,
    cause_concept_id,
    cause_source_value
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};

  // Person ID can be single or array
  if (Array.isArray(person_id) && person_id.length > 0) {
    whereClause.person_id = { [Op.in]: person_id };
  } else if (typeof person_id === "number") {
    whereClause.person_id = person_id;
  }

  // Death date
  if (death_date) {
    whereClause.death_date = death_date;
  }

  // Death type concept
  if (Array.isArray(death_type_concept_id) && death_type_concept_id.length > 0) {
    whereClause.death_type_concept_id = { [Op.in]: death_type_concept_id };
  } else if (typeof death_type_concept_id === "number") {
    whereClause.death_type_concept_id = death_type_concept_id;
  }

  // Cause concept
  if (Array.isArray(cause_concept_id) && cause_concept_id.length > 0) {
    whereClause.cause_concept_id = { [Op.in]: cause_concept_id };
  } else if (typeof cause_concept_id === "number") {
    whereClause.cause_concept_id = cause_concept_id;
  }

  // Cause source value
  if (Array.isArray(cause_source_value) && cause_source_value.length > 0) {
    whereClause.cause_source_value = { [Op.in]: cause_source_value };
  } else if (typeof cause_source_value === "string") {
    whereClause.cause_source_value = cause_source_value;
  }

  return db.death.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
