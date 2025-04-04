const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} mid 
 * @returns {List<Object>} get all contents of the given module
 */
exports.findByModuleId = (mid) => {
  return db.crcContent.findAll({
    attributes: ['id', 'content', 'index'],
    order: [['index', 'ASC']],
    include: [
      {
        model: db.crcContentPage,
      }
    ],
    where: {
      crcModuleId: mid
    }
  })
}

/**
 * Remove contents
 * @param {Number} mid 
 * @returns 
 */
exports.destroyAll = (mid) => {
  return db.crcContent.destroy({
    where: {
      crcModuleId: mid,
    }
  });
};

/**
 * Create contents
 * @param {List<Object>} contents 
 * @returns 
 */
exports.bulkCreate = (contents) => {
  return db.crcContent.bulkCreate(contents);
};

/**
 * Create a module content
 * @param {String} content 
 * @param {Number} index 
 * @param {Number} mid 
 * @returns 
 */
exports.create = (content, index, mid) => {
  return db.crcContent.create({
    content,
    index,
    crcModuleId: mid,
  });
};

/**
 * Update content
 * @param {Number} id 
 * @param {String} content 
 * @returns 
 */
exports.updateContent = (id, content) => {
  return db.crcContent.update({
    content: content,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * Update a content's index
 * @param {Number} id 
 * @param {Number} index 
 * @returns 
 */
exports.updateOrder = (id, index) => {
  return db.crcContent.update({
    index: index,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * destroy a content
 * @param {Number} id 
 * @returns 
 */
exports.destroy = (id) => {
  return db.crcContent.destroy({
    where: {
      id: id,
    }
  });
};