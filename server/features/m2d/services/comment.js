const db = require("../../../models");
const { Op } = require("sequelize");

/**
 *
 * @param {Number} limit
 * @param {Number} mid
 * @param {Number} pid
 * @returns all comments with the given modelId or projectId
 */
exports.findAll = (limit, mid, pid) => {
  return db.m2dComment.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id", "username", "firstName", "lastName", "email"],
        include: [
          {
            model: db.featureUser,
            attributes: ["userId", "role"],
            where: {
              status: "Active",
            },
          },
        ],
      },
      {
        model: db.m2dComment,
        attributes: ["id"],
        as: "childComment",
        limit: 1,
      },
    ],
    where: {
      m2dModelId: mid,
      m2dProjectId: pid,
      visibility: 1,
      replyTo: null,
    },
    order: [["datetime", "DESC"]],
    offset: parseInt(limit) - 10,
    limit: 10,
  });
};

exports.findById = (id) => {
  return db.m2dComment.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.user,
        attributes: ["id"],
      },
    ],
    attributes: ["id"],
  });
};

exports.findByParentId = (limit, id) => {
  return db.m2dComment.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id", "username", "firstName", "lastName", "email"],
        include: [
          {
            model: db.featureUser,
            attributes: ["userId", "role"],
            where: {
              status: "Active",
            },
          },
        ],
      },
      {
        model: db.m2dComment,
        attributes: ["id"],
        as: "childComment",
        limit: 1,
      },
    ],
    where: {
      replyTo: id,
      visibility: 1,
    },
    offset: parseInt(limit) - 10,
    limit: 10,
  });
};

exports.findRepliesByUserId = (uid) => {
  return db.m2dComment.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id", "firstName", "lastName", "avatar"],
        include: [
          {
            model: db.featureUser,
            attributes: [],
            where: {
              status: "Active",
              id: {
                [Op.not]: uid
              }
            }
          }
        ]
      },
      {
        model: db.m2dProject,
        attributes: ["id", "name"],
        required: false,
      },
      {
        model: db.m2dModel,
        attributes: ["id", "name"],
        required: false,
      },
      {
        model: db.m2dComment,
        attributes: ["id", "m2dModelId", "m2dProjectId", "comment", "datetime", "replyTo"],
        as: "parentComment",
        where: {
          visibility: true,
        },
        include: [
          {
            model: db.user,
            attributes: [],
            where: {
              id: uid,
            }
          }
        ]
      }
    ],
    where: {
      userId: {
        [Op.not]: uid,
      },
    },
    order: [["datetime", "DESC"]],
  })
}

exports.findCommentsByProjectByUserId = (uid) => {
  return db.m2dProject.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: db.m2dComment,
        where: {
          userId: {
            [Op.not]: uid
          },
          visibility: true
        },
        include: [
          {
            model: db.user,
            attributes: ["id", "firstName", "lastName", "avatar"],
            include: [
              {
                model: db.featureUser,
                attributes: [],
                where: {
                  status: "Active"
                }
              }
            ]
          }
        ],
        order: [["datetime", "DESC"]],
      },
      {
        model: db.user,
        through: { attributes: [] },
        where: {
          id: uid,
        }
      }
    ],
  })
}

exports.findCommentsByModelByUserId = (uid) => {
  return db.m2dModel.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: db.m2dComment,
        where: {
          userId: {
            [Op.not]: uid
          },
          visibility: true
        },
        include: [
          {
            model: db.user,
            attributes: ["id", "firstName", "lastName", "avatar"],
            include: [
              {
                model: db.featureUser,
                attributes: [],
                where: {
                  status: "Active"
                }
              }
            ],
          }
        ],
        order: [["datetime", "DESC"]],
      },
      {
        model: db.user,
        through: { attributes: [] },
        where: {
          id: uid,
        }
      }
    ],
  })
}

exports.findAllByUserId = (uid) => {
  return db.m2dComment.findAll({
    include: [
      {
        model: db.m2dModel,
        attributes: ["id", "firstName", "lastName", "avatar"],
      },
    ],
    where: {
      userId: uid,
    },
  });
};

exports.create = (comment, replyTo, uid, mid, pid, imgs) => {
  return db.m2dComment.create({
    userId: uid,
    m2dModelId: mid,
    m2dProjectId: pid,
    comment: comment,
    images: imgs,
    datetime: new Date(),
    replyTo: replyTo,
    visibility: 1,
  });
};

exports.destroy = async (id) => {
  db.m2dComment.destroy({
    where: {
      id: id,
    },
  });

  db.m2dComment.update(
    {
      replyTo: -1,
    },
    {
      where: {
        replyTo: id,
      },
    }
  );
};
