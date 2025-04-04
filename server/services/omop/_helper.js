const ORDERS = ["ASC", "DESC"];
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 1000;

/**
 * Helper: Parse pagination & sorting parameters
 */
function getPaginationAndSort(page, pageSize, sortOrder, sortField = "person_id") {
  const pageNum = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

  // Only apply sorting if a valid order is provided
  const order = ORDERS.includes((sortOrder || "").toUpperCase())
    ? [[sortField, sortOrder]]
    : undefined;

  const limit = size > 0 && size <= MAX_PAGE_SIZE ? size : DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limit;

  return { order, offset, limit };
}

const { Op } = require("sequelize");
/**
 * Build a filter for ID fields.
 * If input is an array, return an IN filter; otherwise, return equality.
 */
function buildIdFilter(input) {
  if (Array.isArray(input)) {
    return { [Op.in]: input };
  }
  return input;
}

/**
 * Build a filter for text fields.
 * Supports an object with keys: { contains, startsWith, endsWith, eq },
 * or a direct string (defaults to "contains" match).
 */
function buildTextFilter(input) {
  if (typeof input === "string") {
    return { [Op.like]: `%${input.trim()}%` };
  }
  if (typeof input === "object" && input !== null) {
    if (input.contains) {
      return { [Op.like]: `%${input.contains}%` };
    }
    if (input.startsWith) {
      return { [Op.like]: `${input.startsWith}%` };
    }
    if (input.endsWith) {
      return { [Op.like]: `%${input.endsWith}` };
    }
    if (input.eq) {
      return { [Op.eq]: input.eq };
    }
  }
  return undefined;
}

/**
 * Build a filter for numeric fields.
 * Supports an object with keys: { gt, lt, eq, between }
 * or a single number (equality).
 */
function buildNumericFilter(input) {
  if (typeof input === "number") {
    return { [Op.eq]: input };
  }
  if (typeof input === "object" && input !== null) {
    const filter = {};
    if (input.gt !== undefined) {
      filter[Op.gt] = input.gt;
    }
    if (input.lt !== undefined) {
      filter[Op.lt] = input.lt;
    }
    if (input.eq !== undefined) {
      filter[Op.eq] = input.eq;
    }
    if (Array.isArray(input.between) && input.between.length === 2) {
      filter[Op.between] = input.between;
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }
  return undefined;
}

/**
 * Build a filter for date fields.
 * Supports an object with keys: { gt, lt, eq, between }
 * or a single date string (equality).
 */
function buildDateFilter(input) {
  if (typeof input === "string") {
    return { [Op.eq]: input };
  }
  if (typeof input === "object" && input !== null) {
    const filter = {};
    if (input.gt) {
      filter[Op.gt] = input.gt;
    }
    if (input.lt) {
      filter[Op.lt] = input.lt;
    }
    if (input.eq) {
      filter[Op.eq] = input.eq;
    }
    if (Array.isArray(input.between) && input.between.length === 2) {
      filter[Op.between] = input.between;
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }
  return undefined;
}

module.exports = {
  getPaginationAndSort,
  buildIdFilter,
  buildTextFilter,
  buildNumericFilter,
  buildDateFilter,
};

