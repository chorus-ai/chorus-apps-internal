const db = require("../../models");

/**
 * Find a content page by content id
 * @param {Number} aid 
 * @param {Number} uid
 * @returns {Object} a content page
 */
exports.findByContentId = (aid, uid) => {
  return db.crcAssignmentContent.findOne({
    attributes: ["id", "title", "content"],
    include: [
      {
        model: db.crcUserAssignmentContent,
        attributes: ["value", "details"],
        where: {
          userId: uid,
        },
        required: false,
      }
    ],
    where: {
      crcAssignmentId: aid,
    }
  });
};

/**
 * 
 * @param {String} title 
 * @param {String} content 
 * @param {Number} aid 
 * @returns update content page
 */
exports.update = (title, content, aid) => {
  return db.crcAssignmentContent.update({
    title: title,
    content: content,
  }, {
    where: {
      crcAssignmentId: aid,
    }
  });
};

/**
 * 
 * @param {String} title 
 * @param {String} content 
 * @param {Number} aid 
 * @returns create a content page
 */
exports.create = (title, content, aid) => {
  return db.crcAssignmentContent.create({
    title: title,
    content: content,
    crcAssignmentId: aid,
  });
};

/**
 * 
 * @param {Number} aid 
 * @returns 
 */
exports.destroy = (aid) => {
  return db.crcAssignmentContent.destroy({
    where: {
      crcAssignmentId: aid,
    }
  });
};

/**
 * 
 * @param {Number} uid 
 * @param {Number} acid 
 * @param {Boolean} value 
 * @param {String | null} details 
 * @returns 
 */
exports.createUserAssignmentContent = (uid, acid, value, details=null) => {
  return db.crcUserAssignmentContent.create({
    userId: uid,
    crcAssignmentContentId: acid,
    value: value,
    details: details,
  });
};

/**
 * 
 * @param {Number} uid 
 * @param {Number} acid 
 * @returns 
 */
exports.destroyUserAssignmentContent = (uid, acid) => {
  return db.crcUserAssignmentContent.destroy({
    where: {
      userId: uid,
      crcAssignmentContentId: acid,
    }
  });
}