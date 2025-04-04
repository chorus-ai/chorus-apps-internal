const db = require("../../models");
const { Op } = require("sequelize");
const { Sequelize } = require("../../models");

/**
 * 
 * @param {Number} fid 
 * @returns all surveys belonging to the given feature
 */
exports.findAll = (fid) => {
  return db.survey.findAll({
    include: [
      {
        model: db.user,
        required: false,
        through: {
          model: db.surveyUser,
          attributes: [],
        },
        attributes: ["id", "firstName", "lastName", "email", "username"],
      },
    ],
    where: {
      featureId: fid,
    },
  });
};

exports.findPublicSurveys = (fid) => {
  return db.survey.findAll({
    where: {
      featureId: fid,
      availability: "All Users",
    },
  });
}

/**
 * 
 * @param {Number} uid 
 * @param {Number} fid 
 * @returns all surveys available to the given feature and user
 */
exports.findByUser = (uid, fid) => {
  return db.survey.findAll({
    include: [
      {
        model: db.user,
        required: true,
        through: {
          model: db.surveyUser,
          attributes: [],
        },
        attributes: ["id", "firstName", "lastName", "email", "username"],
        where: {
          id: uid,
        },
      },
    ],
    where: {
      featureId: fid,
      availability: "Selected Users",
    },
  });
};

/**
 * 
 * @param {Number} fid 
 * @returns all admin surveys belonging to the given feature
 */
exports.findAdmin = (fid) => {
  return db.survey.findAll({
    where: {
      featureId: fid,
      availability: "Admin Only",
    },
  });
};

/**
 * 
 * @param {String} title 
 * @param {String} link 
 * @param {String} start 
 * @param {String} end 
 * @param {Number} frequency 
 * @param {Number} availability 
 * @param {String} note
 * @param {Number} fid 
 * @returns a new survey
 */
exports.create = (
  title,
  link,
  start,
  end,
  frequency,
  availability,
  note,
  fid,
) => {
  return db.survey.create({
    title: title,
    link: link,
    start: start,
    end: end,
    frequency: frequency,
    availability: availability,
    note: note,
    featureId: fid,
  });
};

/**
 * 
 * @param {Number} sid 
 * @param {Array<Number>} uids
 * @returns a new survey user
 */
exports.createSurveyUsers = (sid, uids) => {
  return db.surveyUser.bulkCreate(
    uids.map((uid) => {
      return {
        surveyId: sid,
        userId: uid,
      };
    })
  );
};

/**
 * 
 * @param {Number} sid 
 * @param {Object} updateContent 
 * @returns updated survey
 */
exports.update = (sid, updateContent) => {
  return db.survey.update(
    updateContent,
    {
      where: {
        id: sid,
      },
    }
  );
};

/**
 * 
 * @param {Number} sid 
 * @param {Array<Number>} uids 
 * @returns 
 */
exports.removeUsers = (sid, uids) => {
  return db.surveyUser.destroy({
    where: {
      surveyId: sid,
      userId: {
        [Op.in]: uids,
      },
    },
  });
};

/**
 * 
 * @param {Number} sid 
 * @returns 
 */
exports.removeAllUsers = (sid) => {
  return db.surveyUser.destroy({
    where: {
      surveyId: sid,
    },
  });
};

/**
 * 
 * @param {Array<Number>} sids 
 * @returns 
 */
exports.removeSurveys = (sids) => {
  return db.survey.destroy({
    where: {
      id: {
        [Op.in]: sids,
      },
    },
  });
};