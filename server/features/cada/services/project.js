const db = require("../../../models");
const { Op } = require("sequelize");

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 100;

const getPagination = (page = 1, size = DEFAULT_PAGE_SIZE) => ({
  offset: (Math.max(page, 1) - 1) * size,
  limit: size > 0 && size <= MAX_PAGE_SIZE ? size : MAX_PAGE_SIZE,
});

/**
 *
 * @returns all projects
 */
exports.findAll = (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  const { offset, limit } = getPagination(page, pageSize);
  return db.cadaProject.findAll({
    include: [
      {
        model: db.form,
        required: false,
        through: {
          model: db.cadaProjectForm,
          attributes: [],
        },
      },
    ],
    offset,
    limit,
  });
};

/**
 *
 * @param {String} name
 * @param {String} title
 * @param {String} description
 * @param {string} goal
 * @param {String} data
 * @param {String} info
 * @param {String} attributes
 * @param {string} projectType
 * @returns created project
 */
exports.create = (
  name,
  title,
  description,
  goal,
  data,
  info,
  attributes,
  projectType
) => {
  return db.cadaProject.create({
    name: name,
    title: title,
    description: description,
    goal: goal,
    data: data,
    info: info,
    attributes: attributes,
    projectType: projectType,
  });
};

/**
 *
 * @param {Number} pid
 * @returns a project of the given pid
 */
exports.findById = (pid) => {
  return db.cadaProject.findOne({
    include: [
      {
        model: db.form,
        required: false,
        through: {
          model: db.cadaProjectForm,
          attributes: [],
        },
      },
    ],
    where: {
      id: pid,
    },
  });
};

/**
 *
 * @param {Array<Number>} pids projectIds
 * @returns all match projects of the given pids
 */
exports.findByIds = (pids, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  const { offset, limit } = getPagination(page, pageSize);
  return db.cadaProject.findAll({
    include: [
      {
        model: db.form,
        required: false,
        through: {
          model: db.cadaProjectForm,
          attributes: [],
        },
      },
    ],
    where: {
      id: {
        [Op.in]: pids,
      },
    },
    offset,
    limit,
  });
};

/**
 *
 * @param {Number} pid
 * @param {Object} body
 * @returns updated project
 */
exports.update = (pid, body) => {
  return db.cadaProject.update(body, {
    where: {
      id: pid,
    },
  });
};

/**
 *
 * @param {Number} pid
 * @returns remove project
 */
exports.delete = (pid) => {
  return db.cadaProject.destroy({
    where: {
      id: pid,
    },
  });
};

/**
 * @param {Number} pid
 * @returns
 */
exports.findAllProjectUserRole = (
  pid,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
) => {
  const { offset, limit } = getPagination(page, pageSize);
  return db.user.findAll({
    attributes: [
      "id",
      "firstName",
      "lastName",
      "username",
      "email",
      "avatar",
    ],
    include: [
      {
        model: db.cadaProjectUser,
        where: {
          cadaProjectId: pid,
        },
        required: true,
      },
    ],
    offset,
    limit,
  });
};

/**
 *
 * @param {Number} uid
 * @returns a project of the given userId
 */
exports.findProjectUserRolesByUserId = (
  uid,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
) => {
  const { offset, limit } = getPagination(page, pageSize);
  return db.cadaProject.findAll({
    include: [
      {
        model: db.cadaProjectUser,
        where: {
          userId: uid,
        },
        require: true,
      },
      {
        model: db.form,
        required: false,
        through: {
          model: db.cadaProjectForm,
          attributes: [],
        },
        include: [
          {
            model: db.formField,
            required: false,
            separate: true,
            order: [["order", "ASC"]],
            include: [
              {
                model: db.formField,
                as: "triggers",
                required: false,
                attributes: ["id", "type"],
                through: {
                  model: db.formFieldTrigger,
                  as: "formFieldTrigger",
                  attributes: ["id", "condition", "action"],
                },
              },
            ],
            where: {
              active: true,
            },
          },
        ],
      },
    ],
    offset,
    limit,
  });
};

/**
 *
 * @param {Number} pid
 * @returns
 */
exports.findProjectUserRolesByProjectId = (
  pid,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
) => {
  const { offset, limit } = getPagination(page, pageSize);
  return db.user.findAll({
    attributes: ['id', 'firstName', 'lastName', 'email'],
    include: [
      {
        model: db.cadaProjectUser,
        where: {
          cadaProjectId: pid,
        },
        required: true,
      },
    ],
    offset,
    limit,
  });
};

/**
 *
 * @param {Number} pid
 * @param {Number} uid
 * @param {String} role
 * @returns created project user role
 */
exports.createProjectUserRole = (pid, uid, role) => {
  return db.cadaProjectUser.create({
    cadaProjectId: pid,
    userId: uid,
    role: role,
  });
};

/**
 *
 * @param {Number} pid
 * @param {Number} fid
 * @returns
 */
exports.createProjectForm = (pid, fid) => {
  return db.cadaProjectForm.create({
    cadaProjectId: pid,
    formId: fid,
  });
};

/**
 *
 * @param {Number} pid
 * @param {Number} uid
 * @returns a projectuser of the given projectId and userId
 */
exports.findProjectUserRole = (pid, uid) => {
  return db.cadaProjectUser.findAll({
    where: {
      cadaProjectId: pid,
      userId: uid,
    },
  });
};

/**
 *
 * @param {Number} pid
 * @param {Number} uid
 * @param {String} role
 * @returns update projectuser
 */
exports.updateProjectUserRole = (pid, uid, role) => {
  return db.cadaProjectUser.update(
    {
      role: role,
    },
    {
      where: {
        cadaProjectId: pid,
        userId: uid,
      },
    }
  );
};

/**
 *
 * @param {Number} pid
 * @param {Number} uid
 * @param {String} role
 * @returns remove projectuser
 */
exports.deleteProjectUserRole = (pid, uid, role) => {
  return db.cadaProjectUser.destroy({
    where: {
      cadaProjectId: pid,
      userId: uid,
      role: role,
    },
  });
};

/**
 * Count helpers for /count endpoints
 */
exports.countProjectsByUser = (uid) => {
  return db.cadaProjectUser.count({
    where: {
      userId: uid,
    },
  });
};

exports.countUsersInProject = (pid) => {
  return db.cadaProjectUser.count({
    where: {
      cadaProjectId: pid,
    },
  });
};

exports.countAllProjects = () => {
  return db.cadaProject.count();
};