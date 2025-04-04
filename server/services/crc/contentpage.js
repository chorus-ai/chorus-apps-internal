const db = require("../../models");

/**
 * Find a content page by content id
 * @param {Number} cid 
 * @returns {Object} a content page
 */
exports.findByContentId = (cid) => {
  return db.crcContentPage.findOne({
    attributes: ["id", "title", "content"],
    where: {
      crcContentId: cid,
    }
  });
};

/**
 * 
 * @param {String} title 
 * @param {String} content 
 * @param {Number} cid 
 * @returns update content page
 */
exports.update = (title, content, cid) => {
  return db.crcContentPage.update({
    title: title,
    content: content,
  }, {
    where: {
      crcContentId: cid,
    }
  });
};

/**
 * 
 * @param {String} title 
 * @param {String} content 
 * @param {Number} cid 
 * @returns create a content page
 */
exports.create = (title, content, cid) => {
  return db.crcContentPage.create({
    title: title,
    content: content,
    crcContentId: cid,
  });
};

exports.destroy = (cid) => {
  return db.crcContentPage.destroy({
    where: {
      crcContentId: cid,
    }
  });
};