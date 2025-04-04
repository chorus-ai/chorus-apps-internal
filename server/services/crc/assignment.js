const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @param {Number} mid 
 * @returns get all assignments of the given module
 */
exports.findByModuleId = (mid, uid) => {
  return db.crcAssignment.findAll({
    attributes: ['id', 'assignment', 'index'],
    order: [['index', 'ASC']],
    include: [
      {
        model: db.crcAssignmentContent,
        include: [
          {
            model: db.crcUserAssignmentContent,
            where: {
              userId: uid
            },
            order: [['createdAt', 'DESC']],
            required: false,
            limit: 1,
          }
        ],
        required: false,
      },
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
  return db.crcAssignment.destroy({
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
  return db.crcAssignment.bulkCreate(contents);
};

/**
 * Create a module content
 * @param {String} content 
 * @param {Number} index 
 * @param {Number} mid 
 * @returns 
 */
exports.create = (content, index, mid) => {
  return db.crcAssignment.create({
    assignment: content,
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
  return db.crcAssignment.update({
    assignment: content,
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
  return db.crcAssignment.update({
    index: index,
  }, {
    where: {
      id: id,
    }
  });
};

/**
 * destroy an assignment
 * @param {Number} id 
 * @returns 
 */
exports.destroy = (id) => {
  return db.crcAssignment.destroy({
    where: {
      id: id,
    }
  });
};