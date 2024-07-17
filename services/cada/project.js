db = require("../../models");
const { Op } = require("sequelize");

/**
 *
 * @returns all projects
 */
exports.findAll = () => {
  return db.cadaProject.findAll();
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
exports.findByIds = (pids) => {
  return db.cadaProject.findAll({
    where: {
      id: {
        [Op.in]: pids,
      },
    },
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
 *
 * @returns
 */
exports.findAllProjectUserRole = () => {
  return db.cadaProject.findAll({
    include: [
      {
        model: db.cadaProjectUser,
      },
    ],
  });
};

/**
 *
 * @param {Number} uid
 * @returns a project of the given userId
 */
exports.findProjectUserRolesByUserId = (uid) => {
  return db.cadaProject.findAll({
    include: [
      {
        model: db.cadaProjectUser,
        where: {
          userId: uid,
        },
        require: true,
      },
    ],
  });
};

/**
 *
 * @param {Number} pid
 * @returns
 */
exports.findProjectUserRolesByProjectId = (pid) => {
  return db.cadaProject.findAll({
    include: [
      {
        model: db.cadaProjectUser,
        where: {
          cadaProjectId: pid,
        },
        require: true,
      },
    ],
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
