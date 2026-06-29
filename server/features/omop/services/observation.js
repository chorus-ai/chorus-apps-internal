const db = require("../../../models");
const {
  getAttributes,
  getPaginationAndSort,
  buildWhereClause,
} = require("./_helper");

exports.findAll = (attrs, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(
    page,
    pageSize,
    sortOrder,
    "observation_id",
  );
  return db.observation.findAll({
    attributes: getAttributes(attrs, "observation"),
    order,
    offset,
    limit,
  });
};

exports.findByPersonId = (personId, attrs, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(
    page,
    pageSize,
    sortOrder,
    "observation_id",
  );
  return db.observation.findAll({
    where: { person_id: personId },
    attributes: getAttributes(attrs, "observation"),
    order,
    offset,
    limit,
  });
};

exports.findByVisitOccurrenceId = (
  visitOccurrenceId,
  attrs,
  page,
  pageSize,
  sortOrder,
) => {
  const { order, offset, limit } = getPaginationAndSort(
    page,
    pageSize,
    sortOrder,
    "observation_id",
  );
  return db.observation.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    attributes: getAttributes(attrs, "observation"),
    order,
    offset,
    limit,
  });
};

exports.advancedSearch = (searchParams, attrs, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(
    page,
    pageSize,
    sortOrder,
    "observation_id",
  );

  const where = buildWhereClause(searchParams);

  return db.observation.findAll({
    where,
    attributes: getAttributes(attrs, "observation"),
    order,
    offset,
    limit,
  });
};

exports.countByPersonId = (personId) => {
  return db.observation.count({ where: { person_id: personId } });
};

exports.countByVisitOccurrenceId = (visitOccurrenceId) => {
  return db.observation.count({
    where: { visit_occurrence_id: visitOccurrenceId },
  });
};

exports.countBySearch = (searchParams) => {
  const where = buildWhereClause(searchParams);
  return db.observation.count({ where });
};

exports.countAll = () => db.observation.count();
