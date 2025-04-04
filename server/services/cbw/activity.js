const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

/**
 * 
 * @param {Number} pid 
 * @returns {List<Object>} all activities of the given phase
 */
exports.findByPhaseId = (pid) => {
  return db.cbwActivity.findAll({
    include: [
      {
        model: db.cbwActivityContent,
        required: false
      }
    ],
    order: [
      [{ model: db.cbwActivityContent }, 'order', 'ASC']
    ],
    where: {
      cbwPhaseId: pid,
    }
  });
};

/**
 * 
 * @param {Object} activity 
 * @returns {Object} created activity
 */
exports.create = async (activity) => {
  if (activity.order !== null && activity.order !== undefined)
    return db.cbwActivity.create(activity);

  const result = await db.cbwActivity.findAll({
    where: {
      cbwPhaseId: activity.cbwPhaseId,
      group: activity.group
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

  return db.cbwActivity.create({ ...activity, order: order });
};

/**
 * 
 * @param {Object} content 
 * @returns 
 */
exports.createContent = async (content) => {
  if (content.order !== null && content.order !== undefined)
    return db.cbwActivityContent.create(content);

  const result = await db.cbwActivityContent.findAll({
    where: {
      cbwActivityId: content.cbwActivityId,
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

  return db.cbwActivityContent.create({ ...content, order: order });
}

/**
 * 
 * @param {Number} aid 
 * @param {Object} activity 
 * @returns {Object} updated activity
 */
exports.update = (aid, activity) => {
  return db.cbwActivity.update(activity, {
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
  return db.cbwActivityContent.update(content, {
    where: {
      id: cid,
    }
  });
};

/**
 * 
 * @param {Number} aid 
 * @returns {Object} removed activity
 */
exports.delete = async (aid) => {
  // return db.cbwActivity.destroy({
  //   where: {
  //     id: aid,
  //   },
  // });
  const contentToRemove = await db.cbwActivity.findOne({ where: { id: aid } });
  await db.cbwActivity.destroy({ where: { id: aid } });
  console.log(contentToRemove)
  await db.cbwActivity.update(
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
  // return db.cbwActivityContent.destroy({
  //   where: {
  //     id: cid,
  //   },
  // });
  const contentToRemove = await db.cbwActivityContent.findOne({ where: { id: cid } });
  db.cbwActivityContent.destroy({ where: { id: cid } });
  await db.cbwActivityContent.update(
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