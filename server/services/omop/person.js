// services/omop/person.js
const db = require("../../models");
const { Op } = require("sequelize");
const { 
  getPaginationAndSort, 
  buildIdFilter, 
  buildTextFilter, 
  buildNumericFilter, 
  buildDateFilter 
} = require("./_helper");

/**
 * 1. Find Person by Primary Key (no pagination needed)
 */
exports.findById = (pid) => {
  return db.person.findByPk(pid);
};

/**
 * 2. List All People (with pagination & sorting)
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "person_id");
  return db.person.findAll({
    order,
    offset,
    limit,
  });
};

/**
 * 3. Find All People by a Concept (with pagination & sorting)
 */
exports.findByConcept = (cid, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "person_id");
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
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "person_id");
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
 * 5. Advanced Search for People
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "person_id");
  const whereClause = {};

  for (const key of Object.keys(searchParams)) {
    const value = searchParams[key];

    if (key.endsWith("_datetime") || key === "birth_datetime") {
      const filter = buildDateFilter(value);
      if (filter) whereClause[key] = filter;
    }
    else if (key.endsWith("_id")) {
      const filter = buildIdFilter(value);
      if (filter !== undefined) whereClause[key] = filter;
    }
    else if (key.endsWith("_value")) {
      const filter = buildTextFilter(value);
      if (filter) whereClause[key] = filter;
    }
    else {
      const numericFilter = buildNumericFilter(value);
      if (numericFilter) whereClause[key] = numericFilter;
    }
  }

  return db.person.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};

module.exports = exports;
