const db = require("../../models");
const { Op, Sequelize, where } = require("sequelize");

/**
 * 
 * @param {Number} uid 
 * @returns all intake records for a user
 */
exports.findByUser = (uid) => {
  return db.dietIntake.findAll({
    where: {
      userId: uid,
    },
    include: [
      {
        model: db.dietImage,
        where: {
          sourceType: "intake",
        },
        required: false,
        includes: [
          {
            model: db.dietNutrition,
            where: {
              sourceType: "image",
            },
            required: false,
          },
        ]
      },
      {
        model: db.dietText,
        required: false,
        includes: [
          {
            model: db.dietNutrition,
            where: {
              sourceType: "text",
            },
            required: false,
          },
        ]
      },
      {
        model: db.dietNutrition,
        as: "nutritions",
        where: {
          sourceType: "intake",
        },
        required: false,
        includes: [
          {
            model: db.dietNutrition,
            where: {
              sourceType: "image",
            },
            required: false,
          },
        ]
      },
    ],
  });
};

/**
 * 
 * @param {Number} id 
 * @returns intake record by id
 */
exports.findById = (id) => {
  return db.dietIntake.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.dietImage,
        where: {
          sourceType: "intake",
        },
        required: false,
        includes: [
          {
            model: db.dietNutrition,
            where: {
              sourceType: "image",
            },
            required: false,
          },
        ]
      },
      {
        model: db.dietText,
        required: false,
        includes: [
          {
            model: db.dietNutrition,
            where: {
              sourceType: "text",
            },
            required: false,
          },
        ]
      },
      {
        model: db.dietNutrition,
        where: {
          sourceType: "intake",
        },
        required: false,
        includes: [
          {
            model: db.dietNutrition,
            where: {
              sourceType: "image",
            },
            required: false,
          },
        ]
      },
    ],
  });
};

/**
 * 
 * @param {Object} data 
 * @returns create intake record
 */
exports.create = (data) => {
  return db.dietIntake.create(data);
};

/**
 * 
 * @param {Number} id 
 * @param {Object} data 
 * @returns updated intake record
 */
exports.update = (id, data) => {
  return db.dietIntake.update(data, {
    where: {
      id: id,
    },
  });
};

/**
 * 
 * @param {Number} id 
 * @returns 
 */
exports.delete = (id) => {
  return db.dietIntake.destroy({
    where: {
      id: id,
    },
  });
}