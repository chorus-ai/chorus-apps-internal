const db = require("../../models");
const { Op, fn, col } = require("sequelize");

// Helper for pagination & sorting
const ORDERS = ["ASC", "DESC"];
const DEFAULT_SORT = [["id", "DESC"]];
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 1000;

function getPaginationAndSort(page, pageSize, sortOrder) {
  const pageNum = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;
  const order =
    ORDERS.includes((sortOrder || "").toUpperCase()) ? [["id", sortOrder]] : DEFAULT_SORT;

  const limit = size > 0 && size <= MAX_PAGE_SIZE ? size : DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limit;

  return { order, offset, limit };
}

/**
 * List All Cada Files with optional pagination, sorting, and an optional search filter.
 */
exports.findAll = (page, pageSize, sortOrder, search) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};
  if (typeof search === "string" && search.trim() !== "") {
    // partial match on path
    whereClause.path = { [Op.like]: `%${search.trim()}%` };
  }

  return db.cadaFile.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};

/**
 * Get a single Cada File by ID
 */
exports.findById = (fileId) => {
  return db.cadaFile.findOne({
    where: { id: fileId },
  });
};

/**
 * Bulk Create Cada Files
 * @param {Object} t transaction
 * @param {Array<Object>} files array of {path, type, ext, info, ...}
 */
exports.bulkCreate = (t, files) => {
  return db.cadaFile.bulkCreate(files, { transaction: t });
};

/**
 * Check which files already exist by paths
 * @param {Object} t transaction
 * @param {Array<String>} files array of file paths
 */
exports.findByFiles = (t, files) => {
  return db.cadaFile.findAll({
    where: {
      path: { [Op.in]: files },
    },
    attributes: ["id", "path"],
    transaction: t,
  });
};

/**
 * Delete multiple Cada Files by their IDs
 * @param {Array<Number>} fileIds array of file IDs
 */
exports.bulkDelete = (fileIds) => {
  return db.cadaFile.destroy({
    where: { id: { [Op.in]: fileIds } },
  });
};

/**
 * Search for Cada Files by path substring, with pagination/sorting
 */
exports.searchByPath = (page, pageSize, sortOrder, pathString) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};
  if (typeof pathString === "string" && pathString.trim() !== "") {
    // partial match on path
    whereClause.path = { [Op.like]: `%${pathString.trim()}%` };
  }

  return db.cadaFile.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};
