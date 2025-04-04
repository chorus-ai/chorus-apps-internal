const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

const DEFAULT_SORT_ORDER = [["id", "ASC"]];
const ORDERS = ["ASC", "DESC"];
const DEFAULT_LIMIT = 50;

/**
 * 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {String} sortOrder 
 * @returns {Promise<Array>} all forms
 */
exports.findAll = (page, pageSize, sortOrder) => {
  if (!page || page < 1 || !pageSize || pageSize < 1)
    return db.form.findAll({
      order: ORDERS.includes(sortOrder) ? [["id", sortOrder]] : DEFAULT_SORT_ORDER,
      offset: 0,
      limit: DEFAULT_LIMIT,
    });

  return db.form.findAll({
    order: ORDERS.includes(sortOrder) ? [["id", sortOrder]] : DEFAULT_SORT_ORDER,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
};

/**
 * 
 * @param {Number} id 
 * @returns the form with the given id
 */
exports.findById = (id) => {
  return db.form.findByPk(id, {
    orderBy: [[db.formField, 'order', 'ASC']],
    include: [
      {
        model: db.formField,
        required: false,
        include: [{
          model: db.formField,
          as: "triggers",
          required: false,
          attributes: ["id"],
          through: {
            model: db.formFieldTrigger,
            as: "formFieldTrigger",
            attributes: ["id", "condition", "action"],
          },
        }],
        where: {
          active: true,
        }
      },
    ],
  });
};

/**
 * 
 * @param {String} title 
 * @returns created form
 */
exports.create = (title) => {
  return db.form.create({
    title: title,
  });
};

/**
 * 
 * @param {Number} formId 
 * @param {String} label 
 * @param {String} type 
 * @param {Boolean} required 
 * @param {JSON} options 
 * @returns 
 */
exports.createFormField = async (formId, label, type, required, order, options = null) => {
  if (order !== null && order !== undefined)
    return db.formField.create({
      formId: formId,
      label: label,
      type: type,
      required: required,
      order: order,
      options: options,
    });

  const result = await db.formField.findAll({
    where: {
      formId: formId,
      active: true,
    },
    order: [
      ['order', 'DESC']
    ],
    limit: 1
  });

  let newOrder = 1;

  if (result.length !== 0) {
    newOrder = result[0].order + 1;
  }

  return db.formField.create({
    formId: formId,
    label: label,
    type: type,
    required: required,
    order: newOrder,
    options: options,
  });
};

/**
 * 
 * @param {Number} formFieldId 
 * @param {Number} targetFieldId 
 * @param {String} condition 
 * @param {String} action 
 * @returns 
 */
exports.createFormFieldTrigger = (formFieldId, targetFieldId, condition, action) => {
  return db.formFieldTrigger.create({
    formFieldId: formFieldId,
    targetFieldId: targetFieldId,
    condition: condition,
    action: action,
  });
};

/**
 * 
 * @param {Number} id 
 * @param {String} title 
 * @returns updated form
 */
exports.updateForm = (id, title) => {
  return db.form.update(
    {
      title: title,
    },
    {
      where: {
        id: id,
      },
    }
  );
};

/**
 * 
 * @param {Number} id 
 * @param {Object} content 
 * @returns updated form field
 */
exports.updateFormField = (id, content) => {
  return db.formField.update(
    content,
    {
      where: {
        id: id,
      },
    }
  );
};

/**
 * 
 * @param {Number} id 
 * @param {Object} content 
 * @returns updated form trigger
 */
exports.updateFormFieldTrigger = (id, content) => {
  return db.formFieldTrigger.update(
    content,
    {
      where: {
        id: id,
      },
    }
  );
};

/**
 * 
 * @param {Number} id 
 * @returns 
 */
exports.removeFormFieldTrigger = (id) => {
  return db.formFieldTrigger.destroy({
    where: {
      id: id,
    },
  });
};

/**
 * 
 * @param {Number} fid 
 * @returns 
 */
exports.removeTriggerFromFieldId = (fid) => {
  return db.formFieldTrigger.destroy({
    where: {
      targetFieldId: fid,
    },
  });
};

/**
 * 
 * @param {Number} id 
 * @returns 
 */
exports.removeFormFiled = (id) => {
  return db.formField.destroy({
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
exports.removeForm = (id) => {
  return db.form.destroy({
    where: {
      id: id,
    },
  });
};

/**
 * 
 * @param {Number} fid 
 * @param {Number} order
 * @returns 
 */
exports.reorderFromOrder = (fid, order) => {
  return db.formField.update(
    { order: Sequelize.literal('`order` - 1') },
    {
      where: {
        order: {
          [Op.gt]: order
        },
        active: true,
        formId: fid
      }
    }
  )
};