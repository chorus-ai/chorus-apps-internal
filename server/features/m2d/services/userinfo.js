const db = require("../../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} uid 
 * @returns M2D user with their projects and models
 */
exports.findUserWithProjectsAndModelsbyId = (uid) => {
  return db.user.findOne({
    where: {
      id: uid,
    },
    include: [
      {
        model: db.featureUser,
        required: true,
        where: {
          featureId: 2
        }
      },
      {
        model: db.m2dProject,
        required: false,
        where: {
          approveStatus: 'Approved'
        }
      },
      {
        model: db.m2dModel,
        required: false,
        where: {
          approveStatus: 'Approved'
        }
      }
    ]
  });
};