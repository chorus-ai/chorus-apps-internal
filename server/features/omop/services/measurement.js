const db = require("../../../models");
const {
  getAttributes,
  getPaginationAndSort,
  buildWhereClause,
} = require("./_helper");

const MODEL = "measurement";
const PK = "measurement_id";

exports.findAll = (attrs, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(
    page,
    pageSize,
    sortOrder,
    PK,
  );
  return db[MODEL].findAll({
    attributes: getAttributes(attrs, MODEL),
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
    PK,
  );
  return db[MODEL].findAll({
    where: { person_id: personId },
    attributes: getAttributes(attrs, MODEL),
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
    PK,
  );
  return db[MODEL].findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    attributes: getAttributes(attrs, MODEL),
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
    PK,
  );
  const where = buildWhereClause(searchParams);
  return db[MODEL].findAll({
    where,
    attributes: getAttributes(attrs, MODEL),
    order,
    offset,
    limit,
  });
};

exports.countAll = () => db[MODEL].count();
exports.countByPersonId = (personId) =>
  db[MODEL].count({ where: { person_id: personId } });
exports.countByVisitOccurrenceId = (vid) =>
  db[MODEL].count({ where: { visit_occurrence_id: vid } });

exports.countBySearch = (searchParams) => {
  const where = buildWhereClause(searchParams);
  return db[MODEL].count({ where });
};
