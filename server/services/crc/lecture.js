const db = require("../../models");
const { Op } = require("sequelize");

exports.findByModuleId = (mid) => {
  return db.crcLecture.findAll({
    attributes: ['id', 'title', 'link', 'transcript', 'note'],
    where: {
      crcModuleId: mid
    }
  });
};

/**
 * create a video
 * @param {String} title 
 * @param {String} link 
 * @param {String} transcript 
 * @param {String} note 
 * @param {Number} mid 
 * @returns created video
 */
exports.create = (title, link, transcript, note, mid) => {
  return db.crcLecture.create({
    title: title,
    link: link,
    transcript: transcript,
    note: note,
    crcModuleId: mid
  });
};

/**
 * create videos
 * @param {List<Object>} lectures 
 * @returns 
 */
exports.bulkCreate = (lectures) => {
  return db.crcLecture.bulkCreate(lectures);
};

/**
 * update a video
 * @param {String} title 
 * @param {String} link 
 * @param {String} transcript 
 * @param {String} note 
 * @param {Number} id 
 * @returns 
 */
exports.update = (title, link, transcript, note, id) => {
  return db.crcLecture.update({
    title: title,
    link: link,
    transcript: transcript,
    note: note,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * remove a video
 * @param {List<Number>} ids
 * @returns 
 */
exports.remove = (ids) => {
  return db.crcLecture.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    }
  });
};