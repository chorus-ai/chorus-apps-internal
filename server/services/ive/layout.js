// services/ive/layout.js

const db = require("../../models");
const { Op } = require("sequelize");

const ORDERS = ["ASC", "DESC"];
const DEFAULT_SORT = [["id", "DESC"]];
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 1000;

function getPaginationAndSort(page, pageSize, sortOrder) {
  const pageNum = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

  const order = ORDERS.includes((sortOrder || "").toUpperCase())
    ? [["id", sortOrder]]
    : DEFAULT_SORT;

  const limit = size > 0 && size <= MAX_PAGE_SIZE ? size : DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limit;

  return { order, offset, limit };
}

/**
 * 1. List all layout configurations
 */
exports.findAll = async (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.iveLayouts.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get a layout configuration by ID
 */
exports.findById = async (layoutId) => {
  return db.iveLayouts.findByPk(layoutId);
};

/**
 * 3. Create a new layout configuration
 */
exports.createLayout = async (name, config) => {
  return db.iveLayouts.create({ name, config });
};

/**
 * 4. Update an existing layout configuration
 */
exports.updateLayout = async (layoutId, name, config) => {
  const [rowsAffected] = await db.iveLayouts.update(
    { name, config },
    { where: { id: layoutId } }
  );
  if (rowsAffected === 0) {
    return null;
  }
  return db.iveLayouts.findByPk(layoutId);
};

/**
 * 5. Delete a layout configuration
 */
exports.deleteLayout = async (layoutId) => {
  const rowsDeleted = await db.iveLayouts.destroy({
    where: { id: layoutId }
  });
  return rowsDeleted;
};

/**
 * 6. Search for layouts by name
 */
exports.searchByName = async (name, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  if (!name) {
    return db.iveLayouts.findAll({ order, offset, limit });
  }
  return db.iveLayouts.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`
      }
    },
    order,
    offset,
    limit
  });
};
