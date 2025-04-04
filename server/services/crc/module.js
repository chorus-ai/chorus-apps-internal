const db = require("../../models");
const { Op } = require("sequelize");

/**
 * 
 * @returns all modules
 */
exports.findAll = () => {
  return db.crcModule.findAll({
    attributes: ['id', 'name'],
    include: [
      {
        model: db.crcQuizUser,
        required: false,
      }
    ]
  });
};

/**
 * 
 * @param {String} role 
 * @returns all modules of the given role
 */
exports.findByRole = (role, uid) => {
  return role === 'admin' ?
    db.crcModule.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: db.crcModuleRole,
          attributes: ['id', 'role'],
        },
        {
          model: db.crcQuizUser,
          required: false,
          where: {
            userId: uid,
          }
        }
      ]
    })
    :
    db.crcModule.findAll({
      attributes: ['id', 'name'],
      order: [
        ['id', 'ASC'],
        [db.crcModuleProgress, 'createdAt', 'DESC'],
        [db.crcQuizUser, 'score', 'DESC']
      ],
      include: [
        {
          model: db.crcModuleRole,
          attributes: ['id', 'role'],
          where: {
            role: role
          }
        },
        {
          model: db.crcModuleProgress,
          where: {
            userId: uid
          },
          required: false,
          order: [["createdAt", "DESC"]]
        },
        {
          model: db.crcQuizUser,
          required: false,
          where: {
            userId: uid,
          }
        }
      ]
    });
};

/**
 * 
 * @param {Number} id 
 * @returns all contents of a module
 */
exports.findById = (id) => {
  return db.crcModule.findOne({
    attributes: ['id', 'name'],
    include: [
      {
        model: db.crcSummary,
        attributes: ['id', 'summary', 'index'],
        order: [['index', 'ASC']]
      },
      {
        model: db.crcAgenda,
        attributes: ['id', 'title', 'index'],
        order: [['index', 'ASC']],
        include: [
          {
            model: db.crcAgendaContent,
            attributes: ['id', 'content', 'index'],
            order: [['index', 'ASC']],
          },
          {
            model: db.crcFormat,
            attributes: ['id', 'format'],
            through: {
              attributes: []
            }
          }
        ]
      },
      {
        model: db.crcLecture,
        attributes: ['id', 'title', 'link'],
        include: [
          {
            model: db.crcSlide,
            attributes: ['id', 'title', 'link']
          }
        ]
      },
      {
        model: db.crcContent,
        attributes: ['id', 'content', 'index'],
        order: [['index', 'ASC']]
      },
      {
        model: db.crcQuestion,
        attributes: ['id', 'question', 'index'],
        order: [['index', 'ASC']]
      },
      {
        model: db.crcWebSource,
        attributes: ['id', 'content', 'index'],
        order: [['index', 'ASC']],
      },
      {
        model: db.crcAssignment,
        attributes: ['id', 'assignment', 'index'],
        order: [['index', 'ASC']]
      },
      {
        model: db.crcCompetenciesAndEval,
        attributes: ['id', 'content', 'index'],
        order: [['index', 'ASC']]
      }
    ],
    where: {
      id: id
    }
  })
};

/**
 * 
 * @param {Number} mid 
 * @param {Number} uid 
 * @param {Number} progress 
 * @return create a module's progress
 */
exports.setProgress = (mid, uid, progress) => {
  return db.crcModuleProgress.create({
    crcModuleId: mid,
    userId: uid,
    progress: progress,
    createdAt: new Date(),
  });
}

/**
 * Edit module name
 * @param {Number} mid 
 * @param {String} moduleName 
 * @returns updated module
 */
exports.editModuleName = (mid, moduleName) => {
  return db.crcModule.update({
    name: moduleName
  }, {
    where: {
      id: mid
    }
  })
}

exports.remove = (mid) => {
  return db.crcModule.destroy({
    where: {
      id: mid
    }
  })
}