const db = require("../../../models");
const { Op } = require("sequelize");

/**
 *
 * @param {Number} uid
 * @returns all Results that belongs to User whose id is uid
 */
exports.findAllByUserId = (uid) => {
  return db.m2dResult.findAll({
    include: [
      {
        model: db.m2dModel,
        attributes: ["id", "name", "version"],
      },
      {
        model: db.m2dJobStatus,
        attributes: ["id", "status", "time"],
      },
    ],
    where: {
      userId: uid,
    },
  });
};

/**
 *
 * @param {Number} id
 * @param {Array<String>} attributes
 * @returns one Result with id = id
 */
exports.findById = (id, attributes=[]) => {
  const query = {
    include: [
      {
        model: db.m2dJobStatus,
        attributes: ["id", "status", "time"],
      },
      {
        model: db.m2dModel,
        attributes: ["name"],
        include: [
          {
            model: db.m2dModelInputType,
            attributes: ["id", "type"],
          },
          {
            model: db.m2dModelResultType,
            attributes: ["id", "type"],
          }
        ]
      },
    ],
    where: {
      id: id,
    },
  }

  if (attributes.length > 0) {
    query["attributes"] = attributes.includes("id") ? attributes : ["id", ...attributes]
  }

  return db.m2dResult.findOne(query);
};

/**
 *
 * @param {Number} uid
 * @param {Number} mid
 * @param {Array<String>} filenames
 * @param {String} datasaved
 * @returns created Result
 */
exports.create = (uid, mid, filenames, datasaved) => {
  return db.m2dResult.create({
    userId: uid,
    m2dModelId: mid,
    fileName: JSON.stringify({ filenames }),
    dataSaved: datasaved,
  });
};

/**
 *
 * @param {Array<String>} filenames
 * @param {String} datasaved
 * @param {Number} rid
 * @returns updated Result
 */
exports.update = (filenames, datasaved, rid) => {
  return db.m2dResult.update(
    {
      fileName: JSON.stringify({ filenames }),
      dataSaved: datasaved,
    },
    {
      where: {
        id: rid,
      },
    }
  );
};

/**
 *
 * @param {Number} rid
 * @param {Object} values
 * @returns updated result
 */
exports.updateValues = (rid, values) => {
  return db.m2dResult.update(
    {
      value: JSON.stringify({ results: values }),
    },
    {
      where: {
        id: rid,
      },
    }
  );
};

/**
 *
 * @param {Number} id
 * @returns remove result with the given id
 */
exports.destroy = (id) => {
  return db.m2dResult.destroy({
    where: {
      id: id,
    },
    lock: true,
  });
};
