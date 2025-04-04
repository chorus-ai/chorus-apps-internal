const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

/**
 * 
 * @returns {List<Object>} all phases
 */
exports.findAll = () => {
  return db.cbwPhase.findAll({
    order: [
      ['order', 'DESC']
    ],
    include: [
      {
        model: db.cbwActivity,
        required: false,
        include: [
          {
            model: db.cbwActivityContent,
            required: false
          }
        ],
      },
      {
        model: db.cbwDiet,
        required: false,
        include: [
          {
            model: db.cbwDietContent,
            required: false
          }
        ],
      }
    ]
  });
};

/**
 * 
 * @param {Number} order 
 * @returns {Object} phase
 */
exports.findByOrder = (order) => {
  return db.cbwPhase.findOne({
    include: [
      {
        model: db.cbwActivity,
        required: false,
        include: [
          {
            model: db.cbwActivityContent,
            required: false
          }
        ],
        group: 'group',
      },
      {
        model: db.cbwDiet,
        required: false,
        include: [
          {
            model: db.cbwDietContent,
            required: false
          }
        ],
        group: 'group',
      },
    ],
    where: {
      order: order
    }
  });
};

/**
 * 
 * @param {Number} uid 
 * @returns all user progresses by phase descending order
 */
exports.findUserProgress = (uid) => {
  return db.cbwPhase.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id"],
        where: {
          id: uid,
        },
        through: {
          attributes: ["createdAt", "updatedAt"]
        },
        required: true
      },
      {
        model: db.cbwActivity,
        required: false,
        include: [
          {
            model: db.cbwActivityContent,
            required: false
          }
        ]
      },
      {
        model: db.cbwDiet,
        required: false,
        include: [
          {
            model: db.cbwDietContent,
            required: false
          }
        ]
      }
    ],
    order: [
      ['order', 'DESC']
    ],
  });
};

/**
 * 
 * @param {Number} uid 
 * @param {Number} pid 
 * @returns created user progress
 */
exports.createUserProgress = (uid, pid) => {
  return db.cbwUserProgress.create({
    userId: uid,
    cbwPhaseId: pid
  });
};

/**
 * 
 * @param {Object} phase 
 * @returns created phase
 */
exports.create = (phase) => {
  return db.cbwPhase.create(phase);
};

/**
 * 
 * @param {Number} pid 
 * @returns removed phase
 */
exports.delete = async (pid) => {

  const transaction = await db.sequelize_app.transaction();

  try {
    const currPhase = await db.cbwPhase.findOne({
      where: {
        id: pid
      },
      transaction
    });

    console.log(currPhase)

    if (!currPhase) {
      throw new Error("Phase not found");
    }

    let newOrder;

    if (currPhase.dataValues.order === 1) {
      newOrder = 2;
    } else {
      newOrder = currPhase.dataValues.order + 1;
    }

    const newPhase = await db.cbwPhase.findOne({
      where: {
        order: newOrder
      },
      transaction: transaction
    });

    if (newPhase) {
      await db.cbwUserProgress.update({
        cbwPhaseId: newPhase.dataValues.id
      }, {
        where: {
          cbwPhaseId: pid
        },
        transaction: transaction
      });
    }
    await db.cbwPhase.destroy({
      where: {
        id: pid
      },
      transaction: transaction
    });

    await db.cbwPhase.update({
      order: Sequelize.literal('`order` - 1')
    }, {
      where: {
        order: { [Op.gt]: currPhase.dataValues.order }
      },
      transaction: transaction
    });

    await transaction.commit();

    return currPhase;

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.log('err', err)
    throw err;
  }
};

exports.update = (pid, phase) => {
  return db.cbwPhase.update(phase, {
    where: {
      id: pid
    }
  });
};