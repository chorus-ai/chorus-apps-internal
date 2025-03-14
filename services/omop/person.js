// services/omop/person.js
const db = require("../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("./_helper");

/**
 * 1. Find Person by Primary Key
 */
exports.findById = (pid) => {
  return db.person.findByPk(pid);
};

/**
 * 2. List All People (with optional pagination & sorting)
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.person.findAll({
    order,
    offset,
    limit,
  });
};

/**
 * 3. Find All People By a Concept (with pagination & sorting)
 */
exports.findByConcept = (cid, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.person.findAll({
    where: {
      [Op.or]: [
        { gender_concept_id: cid },
        { race_concept_id: cid },
        { ethnicity_concept_id: cid },
        { gender_source_concept_id: cid },
        { race_source_concept_id: cid },
        { ethnicity_source_concept_id: cid },
      ],
    },
    order,
    offset,
    limit,
  });
};

/**
 * 4. Find People by an Array of Person IDs
 */
exports.findByIds = (pids, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.person.findAll({
    where: {
      person_id: { [Op.in]: pids },
    },
    order,
    offset,
    limit,
  });
};

/**
 * 5. Search People by various filters
 */
exports.search = (
  gender_concept_ids,
  race_concept_ids,
  ethnicity_concept_ids,
  start_birth_date,
  end_birth_date,
  page,
  pageSize,
  sortOrder
) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  const where = {};

  if (Array.isArray(gender_concept_ids) && gender_concept_ids.length > 0) {
    where.gender_concept_id = { [Op.in]: gender_concept_ids };
  }
  if (Array.isArray(race_concept_ids) && race_concept_ids.length > 0) {
    where.race_concept_id = { [Op.in]: race_concept_ids };
  }
  if (Array.isArray(ethnicity_concept_ids) && ethnicity_concept_ids.length > 0) {
    where.ethnicity_concept_id = { [Op.in]: ethnicity_concept_ids };
  }
  if (start_birth_date && end_birth_date) {
    where.birth_datetime = { [Op.between]: [start_birth_date, end_birth_date] };
  } else if (start_birth_date) {
    where.birth_datetime = { [Op.gte]: start_birth_date };
  } else if (end_birth_date) {
    where.birth_datetime = { [Op.lte]: end_birth_date };
  }

  return db.person.findAll({
    where,
    order,
    offset,
    limit,
  });
};
