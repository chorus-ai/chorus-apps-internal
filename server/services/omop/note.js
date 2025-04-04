// services/omop/note.js
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
 * 1. List All Notes
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_id");
  return db.note.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Note by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_id");
  return db.note.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Notes by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_id");
  return db.note.findAll({
    where: { person_id: { [Op.in]: personIds } },
    order,
    offset,
    limit
  });
};

/**
 * 4. Get Note by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_id");
  return db.note.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

/**
 * 5. Get Notes by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_id");
  return db.note.findAll({
    where: { visit_occurrence_id: { [Op.in]: visitOccurrenceIds } },
    order,
    offset,
    limit
  });
};

/**
 * 6. Advanced Search for Notes
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_id");
  const whereClause = {};

  for (const key of Object.keys(searchParams)) {
    const value = searchParams[key];

    if (key === "note_date" || key === "note_datetime" || key.endsWith("_date") || key.endsWith("_datetime")) {
      const filter = buildDateFilter(value);
      if (filter) whereClause[key] = filter;
    } else if (key.endsWith("_id")) {
      const filter = buildIdFilter(value);
      if (filter !== undefined) whereClause[key] = filter;
    } else if (key === "note_title" || key === "note_text" || key.endsWith("_source_value")) {
      const filter = buildTextFilter(value);
      if (filter) whereClause[key] = filter;
    } else {
      const numericFilter = buildNumericFilter(value);
      if (numericFilter) whereClause[key] = numericFilter;
    }
  }

  return db.note.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};

module.exports = exports;
