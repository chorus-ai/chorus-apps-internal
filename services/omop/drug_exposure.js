// services/omop/drugExposure.js
const db = require("../../models");
const sequelize = require("sequelize");
const { Op } = sequelize;

const ORDERS = ["ASC", "DESC"];
const DEFAULT_SORT = [["drug_exposure_id", "DESC"]];
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 1000;

/**
 * Helper to parse pagination & sort
 */
function getPaginationAndSort(page, pageSize, sortOrder) {
  const pageNum = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

  const order = ORDERS.includes((sortOrder || "").toUpperCase())
    ? [["drug_exposure_id", sortOrder]]
    : DEFAULT_SORT;

  const limit = size > 0 && size <= MAX_PAGE_SIZE ? size : DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limit;

  return { order, offset, limit };
}

/**
 * 1. List All Drug Exposures
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.drug_exposure.findAll({
    order,
    offset,
    limit,
  });
};

/**
 * 2. Get Drug Exposure by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.drug_exposure.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Drug Exposures by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]); 
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.drug_exposure.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 4. Get Drug Exposure by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.drug_exposure.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

/**
 * 5. Get Drug Exposures by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.drug_exposure.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 6. Search for Drug Exposures by Various Attributes
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const {
    start_drug_exposure_date,
    end_drug_exposure_date,
    person_ids,
    drug_concept_ids,
    provider_ids,
    visit_occurrence_ids,
    drug_type_concept_ids
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};
  if (start_drug_exposure_date && end_drug_exposure_date) {
    whereClause.drug_exposure_start_date = {
      [Op.between]: [start_drug_exposure_date, end_drug_exposure_date]
    };
  } else if (start_drug_exposure_date) {
    whereClause.drug_exposure_start_date = {
      [Op.gte]: start_drug_exposure_date
    };
  } else if (end_drug_exposure_date) {
    whereClause.drug_exposure_start_date = {
      [Op.lte]: end_drug_exposure_date
    };
  }

  // Person IDs
  if (Array.isArray(person_ids) && person_ids.length > 0) {
    whereClause.person_id = { [Op.in]: person_ids };
  }

  // Drug concept IDs
  if (Array.isArray(drug_concept_ids) && drug_concept_ids.length > 0) {
    whereClause.drug_concept_id = { [Op.in]: drug_concept_ids };
  }

  // Provider IDs
  if (Array.isArray(provider_ids) && provider_ids.length > 0) {
    whereClause.provider_id = { [Op.in]: provider_ids };
  }

  // Visit occurrence IDs
  if (Array.isArray(visit_occurrence_ids) && visit_occurrence_ids.length > 0) {
    whereClause.visit_occurrence_id = { [Op.in]: visit_occurrence_ids };
  }

  // Drug type concept IDs
  if (Array.isArray(drug_type_concept_ids) && drug_type_concept_ids.length > 0) {
    whereClause.drug_type_concept_id = { [Op.in]: drug_type_concept_ids };
  }

  return db.drug_exposure.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
