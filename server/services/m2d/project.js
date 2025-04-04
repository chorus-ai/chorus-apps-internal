const db = require("../../models");
const { Op } = require("sequelize");

/**
 *
 * @returns all m2d projects
 */
exports.findAll = () => {
  return db.m2dProject.findAll({
    attributes: ["id", "name", "title", "description"],
    where: {
      approveStatus: "Approved",
    },
    include: [
      {
        model: db.user,
        attributes: ["id", "firstName", "lastName", "avatar"],
        through: {
          attributes: [],
        },
        required: true,
      },
      {
        model: db.m2dModel,
        attributes: ["id", "name", "version"],
        through: {
          attributes: [],
        },
        required: false,
        where: {
          approveStatus: "Approved",
        },
      },
    ],
  });
};

/**
 *
 * @returns all pending projects
 */
exports.findAllPending = () => {
  return db.m2dProject.findAll({
    where: {
      approveStatus: {
        [Op.not]: "Approved",
      },
    },
    include: [
      {
        model: db.user,
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
    ],
    attributes: ["id", "name", "title", "description", "goal", "approveStatus"],
    order: [["id", "DESC"]],
  });
};

/**
 *
 * @param {String} name
 * @returns projects with given name
 */
exports.findAllByName = (name) => {
  return db.m2dProject.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
    attributes: ["id", "title", "description", "goal"],
  });
};

/**
 *
 * @param {Number} id
 * @returns project with given id
 */
exports.findById = (id) => {
  return db.m2dProject.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.m2dModel,
        attributes: ["id", "name", "version", "details"],
        required: false,
      },
      {
        model: db.user,
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
      {
        model: db.m2dProjectReject,
        attributes: ["id", "m2dProjectId", "rejectReason", "time"],
        required: false,
      },
    ],
    attributes: ["id", "name", "title", "description", "goal", "approveStatus"],
  });
};

/**
 *
 * @param {String} name
 * @returns projects with given name or title
 */
exports.findByNameOrTitle = (name) => {
  return db.m2dProject.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
    ],
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${name}%` } },
        { title: { [Op.like]: `%${name}%` } },
      ],
    },
    attributes: ["id", "name", "title", "description", "goal", "approveStatus"],
    order: [["id", "DESC"]],
    limit: 10,
  });
};

/**
 *
 * @param {Number} uid
 * @returns projects that belongs to the given user
 */
exports.getAllProjectNamesAndIdsByUserId = async (uid) => {
  const user = await db.user.findOne({
    include: [
      {
        model: db.featureUser,
        attributes: [],
        where: {
          role: "Admin",
          status: "Active"
        },
        required: true,
      }
    ],
    where: {
      id: uid
    }
  })
  
  if (user) {
    return db.m2dProject.findAll({
      attributes: ["id", "name"],
    })
  }

  return db.m2dProject.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: db.user,
        attributes: [],
        where: {
          id: uid,
        },
      },
    ],
  });
};

/**
 *
 * @param {Number} uid
 * @param {String} name
 * @param {String} title
 * @param {String} description
 * @param {String} goal
 * @returns created project
 */
exports.create = async (uid, name, title, description, goal, models) => {
  const project = await db.m2dProject.create({
    name: name,
    title: title,
    description: description,
    goal: goal,
    approveStatus: "Under review",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  await db.m2dProjectUser.create({
    m2dProjectId: project.dataValues.id,
    userId: uid,
  });

  if (models.length > 0) {
    await db.m2dProjectModel.bulkCreate(
      models.map((model) => {
        return { m2dProjectId: project.dataValues.id, m2dModelId: model.id };
      })
    );
  }

  return project;
};

/**
 *
 * @param {Number} pid
 * @param {String} name
 * @param {String} title
 * @param {String} description
 * @param {String} goal
 * @param {Array<Number>} uids
 * @param {Array<Number>} mids
 * @param {Boolean} needApprove
 * @returns updated project
 */
exports.edit = async (pid, name, title, description, goal, uids, mids, needApprove) => {

  const updateBody = {
    name: name,
    title: title,
    description: description,
    goal: goal,
    updatedAt: new Date()
  };

  if (needApprove) {
    updateBody.approveStatus = "Under review";
  }

  await db.m2dProject.update(
    updateBody,
    {
      where: {
        id: pid,
      },
    }
  );

  await db.m2dProjectUser.destroy({
    where: {
      m2dProjectId: pid,
    },
  });

  const users = uids.map((uid) => {
    return { m2dProjectId: pid, userId: uid };
  });

  await db.m2dProjectUser.bulkCreate(users);

  await db.m2dProjectModel.destroy({
    where: {
      m2dProjectId: pid,
    },
  });

  const models = mids.map((mid) => {
    return { m2dProjectId: pid, m2dModelId: mid };
  });

  await db.m2dProjectModel.bulkCreate(models);

  return;
};

/**
 *
 * @param {Number} pid
 * @returns all projectusers with the given project
 */
exports.findProjectUsersByProjectId = (pid) => {
  return db.m2dProjectUser.findAll({
    where: {
      m2dProjectId: pid,
    },
  });
};

/**
 *
 * @param {Number} uid
 * @returns unapproved projects of the given user
 */
exports.findUnapprovedProjectsByUserId = (uid) => {
  return db.user.findAll({
    where: {
      id: uid,
    },
    include: [
      {
        model: db.m2dProject,
        attributes: ["id", "title", "name", "description", "approveStatus"],
        where: {
          approveStatus: { [Op.not]: "Approved" },
        },
        include: [
          {
            model: db.m2dModel,
            attributes: ["id"],
            where: {
              approveStatus: "Approved",
            },
            required: false,
          },
          {
            model: db.user,
            attributes: ["id", "firstName", "lastName", "avatar"],
          },
        ],
      },
    ],
  });
};

/**
 *
 * @param {Number} pid
 * @returns remove given project
 */
exports.remove = (pid) => {
  return db.m2dProject.destroy({
    where: {
      id: pid,
    },
  });
};

/**
 *
 * @param {Number} uid
 * @param {Number} pid
 * @returns remove user from project
 */
exports.removeUserFromProject = (uid, pid) => {
  return db.m2dProjectUser.destroy({
    where: {
      userId: uid,
      m2dProjectId: pid,
    },
  });
};

/**
 *
 * @param {Number} id
 * @returns change the given project's status to approved
 */
exports.approve = (id) => {
  return db.m2dProject.update(
    {
      approveStatus: "Approved",
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
 * @param {Number} pid
 * @param {Number} adminId
 * @param {String} rejectReason
 */
exports.reject = async (pid, adminId, rejectReason) => {
  await db.m2dProject.update(
    {
      approveStatus: "Rejected",
    },
    {
      where: {
        id: pid,
      },
    }
  );
  await db.m2dProjectReject.create({
    m2dProjectId: pid,
    rejectReason: rejectReason,
    time: new Date(),
    adminId: adminId,
  });
};
