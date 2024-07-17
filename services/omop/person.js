const db = require("../../models");
const { Op } = require("sequelize");

const DEFAULT_SORT_ORDER = [["person_id", "ASC"]];

/**
 * 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {Array<Array<String>>} sortOrder 
 * @returns all people
 */
exports.findAll = (page, pageSize, sortOrder) => {
  if (!page || page < 1 || !pageSize || pageSize < 1)
    return db.person.findAll({
      order: sortOrder || DEFAULT_SORT_ORDER,
    });

  return db.person.findAll({
    order: sortOrder || DEFAULT_SORT_ORDER,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
};

/**
 * 
 * @param {Number} cid 
 * @returns all people with the given concept
 */
exports.findByConcept = (cid) => {
  return db.person.findAll({
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