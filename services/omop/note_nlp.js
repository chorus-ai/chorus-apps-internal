// services/omop/note_nlp.js
const db = require("../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("./_helper");

/**
 * 1. List All Note NLP Entries
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
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
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
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
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.note_nlp.findAll({
    where: {
      note_id: { [Op.in]: noteIds }
    },
    order,
    offset,
    limit,
  });
};

/**
 * 4. Advanced Search in Note NLP Entries
 *    Searches by attributes such as nlp_system, note_nlp_concept_ids, and term_exists.
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { nlp_system, note_nlp_concept_ids, term_exists } = searchParams;
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};

  if (nlp_system && typeof nlp_system === "string" && nlp_system.trim() !== "") {
    whereClause.nlp_system = { [Op.like]: `%${nlp_system.trim()}%` };
  }

  if (Array.isArray(note_nlp_concept_ids) && note_nlp_concept_ids.length > 0) {
    whereClause.note_nlp_concept_id = { [Op.in]: note_nlp_concept_ids };
  } else if (typeof note_nlp_concept_ids === "number") {
    whereClause.note_nlp_concept_id = note_nlp_concept_ids;
  }

  if (term_exists && typeof term_exists === "string") {
    whereClause.term_exists = term_exists;
  }

  return db.note_nlp.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};
