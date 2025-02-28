const db = require("../../models");
const sequelize = require("sequelize");
const { Op } = sequelize;

const ORDERS = ["ASC", "DESC"];
const DEFAULT_SORT = [["visit_occurrence_id", "DESC"]]; // default: desc
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 1000;

function getPaginationAndSort(page, pageSize, sortOrder) {
  const pageNum = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

  const order = ORDERS.includes((sortOrder || "").toUpperCase())
    ? [["visit_occurrence_id", sortOrder]]
    : DEFAULT_SORT;

  const limit = size > 0 && size <= MAX_PAGE_SIZE ? size : DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limit;

  return { order, offset, limit };
}

exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_occurrence.findAll({
    order,
    offset,
    limit,
    // If you want to include the Person row or concept row:
    // include: [{ model: db.person, as: "person", required: false }]
  });
};

exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_occurrence.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit,
  });
};

exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]); 
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_occurrence.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit,
  });
};

exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  // Typically you'd expect at most one row, but we can still do findAll
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_occurrence.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit,
  });
};

exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_occurrence.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit,
  });
};

exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { 
    start_date,
    end_date,
    person_ids,
    visit_concept_ids,
    provider_ids,
    care_site_ids,
    visit_type_concept_ids,
    // add more as needed
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  // Build the "where" clause
  const whereClause = {};

  if (start_date && end_date) {
    // Filter visits that started between these dates
    whereClause.visit_start_date = {
      [Op.between]: [start_date, end_date]
    };
  } else if (start_date) {
    whereClause.visit_start_date = { [Op.gte]: start_date };
  } else if (end_date) {
    whereClause.visit_start_date = { [Op.lte]: end_date };
  }

  if (Array.isArray(person_ids) && person_ids.length > 0) {
    whereClause.person_id = { [Op.in]: person_ids };
  }
  if (Array.isArray(visit_concept_ids) && visit_concept_ids.length > 0) {
    whereClause.visit_concept_id = { [Op.in]: visit_concept_ids };
  }
  if (Array.isArray(provider_ids) && provider_ids.length > 0) {
    whereClause.provider_id = { [Op.in]: provider_ids };
  }
  if (Array.isArray(care_site_ids) && care_site_ids.length > 0) {
    whereClause.care_site_id = { [Op.in]: care_site_ids };
  }
  if (Array.isArray(visit_type_concept_ids) && visit_type_concept_ids.length > 0) {
    whereClause.visit_type_concept_id = { [Op.in]: visit_type_concept_ids };
  }

  return db.visit_occurrence.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};
