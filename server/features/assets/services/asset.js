const db = require("../../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("../../omop/services/_helper");

/**
 * List assets with optional pagination.
 */
exports.findAll = async (page, pageSize) => {
  const { offset, limit } = getPaginationAndSort(page, pageSize);
  const { count, rows } = await db.asset.findAndCountAll({
    offset,
    limit,
    order: [["id", "ASC"]],
  });
  return { count, rows };
};

/**
 * Partial‐match search on any combination of fields.
 */
exports.search = async (filters, page, pageSize) => {
  const { offset, limit } = getPaginationAndSort(page, pageSize);

  // build WHERE clause
  const where = {};
  if (filters.source) {
    where.source = { [Op.like]: `%${filters.source}%` };
  }
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.ext) {
    where.ext = filters.ext;
  }
  if (filters.info) {
    where.info = { [Op.like]: `%${filters.info}%` };
  }

  const { count, rows } = await db.asset.findAndCountAll({
    where,
    offset,
    limit,
    order: [["id", "ASC"]],
  });
  return { count, rows };
};

/**
 * Get a single asset by ID.
 */
exports.getById = async (id) => {
  return db.asset.findByPk(id);
};

/**
 * Bulk create assets.
 */
exports.bulkCreate = async (assets) => {
  const created = await db.asset.bulkCreate(assets, { returning: true });
  return {
    inserted: created.length,
    ids: created.map((a) => a.id),
  };
};

/**
 * Update one asset.
 */
exports.updateById = async (id, updateFields) => {
  const [ updatedCount ] = await db.asset.update(updateFields, {
    where: { id },
    returning: true,
  });
  return { updated: updatedCount, id };
};

/**
 * Delete one asset.
 */
exports.deleteById = async (id) => {
  const deleted = await db.asset.destroy({ where: { id } });
  return deleted === 1;
};

/**
 * Bulk delete.
 */
exports.bulkDelete = async (ids) => {
  const deletedCount = await db.asset.destroy({ where: { id: { [Op.in]: ids } } });
  return { deleted: deletedCount };
};
