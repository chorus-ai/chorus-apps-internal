// services/omop/observation.js

const db = require("../../models");
const sequelize = require("sequelize");
const { Op } = sequelize;

const ORDERS = ["ASC", "DESC"];
const DEFAULT_SORT = [["observation_id", "DESC"]];
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 1000;

/**
 * Helper: parse page, pageSize, sortOrder
 */
function getPaginationAndSort(page, pageSize, sortOrder) {
  const pageNum = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

  const order = ORDERS.includes((sortOrder || "").toUpperCase())
    ? [["observation_id", sortOrder]]
    : DEFAULT_SORT;

  const limit = size > 0 && size <= MAX_PAGE_SIZE ? size : DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limit;

  return { order, offset, limit };
}

/**
 * 1. List All Observations
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.observation.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Observation by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.observation.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Observations by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]); 
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.observation.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 4. Get Observation by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.observation.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

/**
 * 5. Get Observations by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.observation.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 6. Search Observations by Various Attributes
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { 
    start_date,
    end_date,
    value_as_number,
    value_as_concept_id,
    person_ids,
    visit_occurrence_ids,
    observation_concept_ids
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};

  if (start_date && end_date) {
    whereClause.observation_date = {
      [Op.between]: [start_date, end_date]
    };
  } else if (start_date) {
    whereClause.observation_date = { [Op.gte]: start_date };
  } else if (end_date) {
    whereClause.observation_date = { [Op.lte]: end_date };
  }

  if (typeof value_as_number === "number") {
    whereClause.value_as_number = value_as_number;
  }

  if (typeof value_as_concept_id === "number") {
    whereClause.value_as_concept_id = value_as_concept_id;
  }

  if (Array.isArray(person_ids) && person_ids.length > 0) {
    whereClause.person_id = { [Op.in]: person_ids };
  }
  if (Array.isArray(visit_occurrence_ids) && visit_occurrence_ids.length > 0) {
    whereClause.visit_occurrence_id = { [Op.in]: visit_occurrence_ids };
  }
  if (Array.isArray(observation_concept_ids) && observation_concept_ids.length > 0) {
    whereClause.observation_concept_id = { [Op.in]: observation_concept_ids };
  }

  return db.observation.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
