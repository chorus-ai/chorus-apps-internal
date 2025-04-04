const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

/**
 * 
 * @param {Number} pid 
 * @returns {List<Object>} all activities of the given phase
 */
exports.findByPhaseId = (pid) => {
  return db.cbwDiet.findAll({
    include: [
      {
        model: db.cbwDietContent,
        required: false,
      }
    ],
    order: [
      [{ model: db.cbwDietContent }, 'order', 'ASC']
    ],
    where: {
      cbwPhaseId: pid,
    }
  });
};

/**
 * 
 * @param {Object} diet 
 * @returns {Object} created diet
 */
exports.create = async (diet) => {
  if (diet.order !== null && diet.order !== undefined)
    return db.cbwDiet.create(diet);

  const result = await db.cbwDiet.findAll({
    where: {
      cbwPhaseId: diet.cbwPhaseId,
      group: diet.group
    },
    order: [
      ['order', 'DESC']
    ],
    limit: 1
  });

  let order = 1;

  if (result.length !== 0) {
    order = result[0].order + 1;
  }

  return db.cbwDiet.create({ ...diet, order: order });
};

/**
 * 
 * @param {Object} content 
 * @returns 
 */
exports.createContent = async (content) => {
  if (content.order !== null && content.order !== undefined)
    return db.cbwDietContent.create(content);

  const result = await db.cbwDietContent.findAll({
    where: {
      cbwDietId: content.cbwDietId,
    },
    order: [
      ['order', 'DESC']
    ],
    limit: 1
  });

  let order = 1;

  if (result.length !== 0) {
    order = result[0].order + 1;
  }

  return db.cbwDietContent.create({ ...content, order: order });
}

/**
 * 
 * @param {Number} aid 
 * @param {Object} diet 
 * @returns {Object} updated diet
 */
exports.update = (aid, diet) => {
  return db.cbwDiet.update(diet, {
    where: {
      id: aid,
    }
  });
};

/**
 * 
 * @param {Number} cid 
 * @param {Object} content 
 * @returns {Object} updated content
 */
exports.updateContent = (cid, content) => {
  return db.cbwDietContent.update(content, {
    where: {
      id: cid,
    }
  });
};

/**
 * 
 * @param {Number} aid 
 * @returns {Object} removed diet
 */
exports.delete = async (aid) => {
  // return db.cbwDiet.destroy({
  //   where: {
  //     id: aid,
  //   },
  // });
  const contentToRemove = await db.cbwDiet.findOne({ where: { id: aid } });
  await db.cbwDiet.destroy({ where: { id: aid } });
  console.log(contentToRemove)
  await db.cbwDiet.update(
    { order: Sequelize.literal('`order` - 1') },
    {
      where: {
        order: {
          [Op.gt]: contentToRemove.dataValues.order
        },
        group: contentToRemove.dataValues.group
      }
    }
  );

  return contentToRemove;
};

/**
 * 
 * @param {Number} cid 
 * @returns {Object} removed content
 */
exports.deleteContent = async (cid) => {
  // return db.cbwDietContent.destroy({
  //   where: {
  //     id: cid,
  //   },
  // });
  const contentToRemove = await db.cbwDietContent.findOne({ where: { id: cid } });
  db.cbwDietContent.destroy({ where: { id: cid } });
  await db.cbwDietContent.update(
    { order: Sequelize.literal('`order` - 1') },
    {
      where: {
        order: {
          [Op.gt]: contentToRemove.dataValues.order
        },
      }
    }
  );
  return contentToRemove;
};