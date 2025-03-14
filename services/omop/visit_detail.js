// services/omop/visit_detail.js
const db = require("../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("./_helper");

/**
 * 1. List All Visit Details
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_detail.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Visit Detail by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_detail.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Visit Details by array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_detail.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 4. Get Visit Detail by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_detail.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

/**
 * 5. Get Visit Details by array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.visit_detail.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 6. Search Visit Details by various attributes
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const {
    start_date,
    end_date,
    person_ids,
    visit_occurrence_ids,
    visit_detail_type_concept_ids,
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};
  if (start_date && end_date) {
    whereClause.visit_detail_start_date = { [Op.between]: [start_date, end_date] };
  } else if (start_date) {
    whereClause.visit_detail_start_date = { [Op.gte]: start_date };
  } else if (end_date) {
    whereClause.visit_detail_start_date = { [Op.lte]: end_date };
  }

  if (Array.isArray(person_ids) && person_ids.length > 0) {
    whereClause.person_id = { [Op.in]: person_ids };
  }
  if (Array.isArray(visit_occurrence_ids) && visit_occurrence_ids.length > 0) {
    whereClause.visit_occurrence_id = { [Op.in]: visit_occurrence_ids };
  }
  if (Array.isArray(visit_detail_type_concept_ids) && visit_detail_type_concept_ids.length > 0) {
    whereClause.visit_detail_type_concept_id = { [Op.in]: visit_detail_type_concept_ids };
  }

  return db.visit_detail.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
