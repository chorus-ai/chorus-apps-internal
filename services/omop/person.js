const db = require("../../models");
const { Op } = require("sequelize");

const DEFAULT_SORT_ORDER = [["person_id", "ASC"]];
const ORDERS = ["ASC", "DESC"];
const DEFAULT_LIMIT = 1000;

/**
 * 
 * @param {Number} pid 
 * @returns {Object} a person
 */
exports.findById = (pid) => {
  return db.person.findByPk(pid, {
    include: [
      {
        model: db.concept,
        required: false,
        where: {
          concept_id: db.Sequelize.col("person.gender_concept_id"),
        },
      },
      {
        model: db.concept,
        required: false,
        where: {
          concept_id: db.Sequelize.col("person.race_concept_id"),
        }
      },
      {
        model: db.concept,
        required: false,
        where: {
          concept_id: db.Sequelize.col("person.ethnicity_concept_id"),
        }
      },
    ]
  });
}

/**
 * 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {String} sortOrder - ASC or DESC"
 * @returns all people
 */
exports.findAll = (page, pageSize, sortOrder) => {
  if (!page || page < 1 || !pageSize || pageSize < 1)
    return db.person.findAll({
      order: ORDERS.includes(sortOrder) ? [["person_id", sortOrder]] : DEFAULT_SORT_ORDER,
      offset: 0,
      limit: 1000,
    });

  return db.person.findAll({
    order: ORDERS.includes(sortOrder) ? [["person_id", sortOrder]] : DEFAULT_SORT_ORDER,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
};

/**
 * 
 * @param {Number} cid 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {String} sortOrder - ASC or DESC"
 * @returns all people with the given concept
 */
exports.findByConcept = (cid, page, pageSize, sortOrder) => {
  return db.person.findAll({
    offset: !page || page < 1 || !pageSize || pageSize < 1 ? 0 : (page - 1) * pageSize,
    limit: !page || page < 1 || !pageSize || pageSize < 1 ? DEFAULT_LIMIT : pageSize,
    order: ORDERS.includes(sortOrder) ? [["person_id", sortOrder]] : DEFAULT_SORT_ORDER,
    include: [
      {
        model: db.concept,
        as: "concept",
        required: false,
      }
    ],
    where: {
      [Op.or]: [
        {
          gender_concept_id: cid
        },
        {
          race_concept_id: cid
        },
        {
          ethnicity_concept_id: cid
        },
        {
          gender_source_concept_id: cid
        },
        {
          race_source_concept_id: cid
        },
        {
          ethnicity_source_concept_id: cid
        }
      ]
    }
  });
};

/**
 * 
 * @param {Number[]} pids 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {'asc' | 'desc'} sortOrder 
 * @returns {Promise<Object[]>} all people with the given ids
 */
exports.findByIds = (pids, page, pageSize, sortOrder) => {
  return db.person.findAll({
    offset: !page || page < 1 || !pageSize || pageSize < 1 ? 0 : (page - 1) * pageSize,
    limit: !page || page < 1 || !pageSize || pageSize < 1 ? DEFAULT_LIMIT : pageSize,
    order: ORDERS.includes(sortOrder) ? [["person_id", sortOrder]] : DEFAULT_SORT_ORDER,
    where: {
      person_id: {
        [Op.in]: pids
      }
    }
  });
};

/**
 * @param {Number[] | undefined} gender_concept_ids
 * @param {Number[] | undefined} race_concept_ids
 * @param {Number[] | undefined} ethnicity_concept_ids
 * @param {String | undefined} start_birth_date
 * @param {String | undefined} end_birth_date
 * @param {Number | undefined} page
 * @param {Number | undefined} pageSize
 * @param {'ASC' | 'DESC'} sortOrder
 * @returns {Promise<Object[]>}
 */
exports.search = (
  gender_concept_ids,
  race_concept_ids,
  ethnicity_concept_ids,
  start_birth_date,
  end_birth_date,
  page,
  pageSize,
  sortOrder
) => {
  const where = {};
  if (Array.isArray(gender_concept_ids) && gender_concept_ids.length > 0) {
    where.gender_concept_id = { [Op.in]: gender_concept_ids };
  }
  if (Array.isArray(race_concept_ids) && race_concept_ids.length > 0) {
    where.race_concept_id = { [Op.in]: race_concept_ids };
  }
  if (Array.isArray(ethnicity_concept_ids) && ethnicity_concept_ids.length > 0) {
    where.ethnicity_concept_id = { [Op.in]: ethnicity_concept_ids };
  }

  if (start_birth_date && end_birth_date) {
    where.birth_datetime = { [Op.between]: [start_birth_date, end_birth_date] };
  } else if (start_birth_date) {
    where.birth_datetime = { [Op.gte]: start_birth_date };
  } else if (end_birth_date) {
    where.birth_datetime = { [Op.lte]: end_birth_date };
  }

  return db.person.findAll({
    order: ORDERS.includes(sortOrder) ? [["person_id", sortOrder]] : DEFAULT_SORT_ORDER,
    offset: !page || page < 1 || !pageSize || pageSize < 1 ? 0 : (page - 1) * pageSize,
    limit: !page || page < 1 || !pageSize || pageSize < 1 ? DEFAULT_LIMIT : pageSize,
    where,
  });
};