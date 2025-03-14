const db = require("../../models");
const sequelize = require("sequelize");
const { Op } = sequelize;
const { getPaginationAndSort } = require("./_helper");

exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.measurement.findAll({
    order,
    offset,
    limit
  });
};

exports.search = (name, page, pageSize, exactMatch = false) => {
  if (typeof name !== "string") {
    throw new TypeError("Name must be a string");
  }

  const searchString = name.toLowerCase().trim();
  const conditions = exactMatch
    ? { [Op.eq]: searchString }
    : { [Op.like]: `%${searchString}%` };

  const { order, offset, limit } = getPaginationAndSort(page, pageSize);

  return db.concept.findAll({
    logging: console.log,
    where: { concept_name: conditions },
    offset,
    limit,
    order
  });
};

exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.measurement.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.measurement.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.measurement.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.measurement.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit
  });
};

exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { 
    start_datetime, 
    end_datetime, 
    range_low, 
    range_high,
    value_as_number, 
    value_as_concept_id,
    person_ids,
    visit_occurrence_ids,
    measurement_concept_ids,
    operator_concept_ids,
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};

  if (start_datetime && end_datetime) {
    whereClause.measurement_datetime = {
      [Op.between]: [start_datetime, end_datetime]
    };
  } else if (start_datetime) {
    whereClause.measurement_datetime = { [Op.gte]: start_datetime };
  } else if (end_datetime) {
    whereClause.measurement_datetime = { [Op.lte]: end_datetime };
  }

  if (typeof value_as_number === "number") {
    whereClause.value_as_number = value_as_number;
  }

  if (typeof range_low === "number" && typeof range_high === "number") {
    // For instance, if you want the measurement's value to be within [range_low, range_high]
    whereClause.value_as_number = {
      [Op.between]: [range_low, range_high]
    };
  }

  if (Array.isArray(person_ids) && person_ids.length > 0) {
    whereClause.person_id = { [Op.in]: person_ids };
  }
  if (Array.isArray(visit_occurrence_ids) && visit_occurrence_ids.length > 0) {
    whereClause.visit_occurrence_id = { [Op.in]: visit_occurrence_ids };
  }
  if (Array.isArray(measurement_concept_ids) && measurement_concept_ids.length > 0) {
    whereClause.measurement_concept_id = { [Op.in]: measurement_concept_ids };
  }


  return db.measurement.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
