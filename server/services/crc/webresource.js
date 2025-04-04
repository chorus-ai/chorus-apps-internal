const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} mid 
 * @returns get all web resources of the given module
 */
exports.findByModuleId = (mid) => {
  return db.crcWebResource.findAll({
    attributes: ['id', 'content', 'index'],
    order: [['index', 'ASC']],
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
  return db.crcWebResource.destroy({
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
  return db.crcWebResource.bulkCreate(contents);
};

/**
 * Create a module content
 * @param {String} content 
 * @param {Number} index 
 * @param {Number} mid 
 * @returns 
 */
exports.create = (content, index, mid) => {
  return db.crcWebResource.create({
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
  return db.crcWebResource.update({
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
  return db.crcWebResource.update({
    index: index,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * destroy a resource
 * @param {Number} id 
 * @returns 
 */
exports.destroy = (id) => {
  return db.crcWebResource.destroy({
    where: {
      id: id,
    }
  });
};