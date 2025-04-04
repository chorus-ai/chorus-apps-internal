// services/omop/note_nlp.js
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
 * 1. List All Note NLP Entries
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_nlp_id");
  return db.note_nlp.findAll({
    order,
    offset,
    limit,
  });
};

/**
 * 2. Get Note NLP by Note ID
 */
exports.findByNoteId = (noteId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_nlp_id");
  return db.note_nlp.findAll({
    where: { note_id: noteId },
    order,
    offset,
    limit,
  });
};

/**
 * 3. Get Note NLP by an Array of Note IDs
 */
exports.findByNoteIds = (noteIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(noteIds) || noteIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_nlp_id");
  return db.note_nlp.findAll({
    where: { note_id: { [Op.in]: noteIds } },
    order,
    offset,
    limit,
  });
};

/**
 * 4. Advanced Search in Note NLP Entries
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "note_nlp_id");
  const whereClause = {};

  for (const key of Object.keys(searchParams)) {
    const value = searchParams[key];

    if (key.endsWith("_id")) {
      const filter = buildIdFilter(value);
      if (filter !== undefined) whereClause[key] = filter;
    } else if (key.endsWith("_date") || key.endsWith("_datetime")) {
      const filter = buildDateFilter(value);
      if (filter) whereClause[key] = filter;
    } else {
      // For all other fields, treat them as text fields.
      const filter = buildTextFilter(value);
      if (filter) whereClause[key] = filter;
    }
  }

  return db.note_nlp.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};

module.exports = exports;
