const db = require("../../models");
const { Op } = require("sequelize");
const { readFile } = require("./_helper");

/**
 *
 * @returns all models
 */
exports.findAll = () => {
  return db.m2dModel.findAll({
    attributes: ["id", "name", "details", "version", "dataDescription", "exampleFile", "createdAt", "updatedAt"],
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
        model: db.m2dProject,
        attributes: ["id"],
        through: {
          attributes: [],
        },
        required: false,
        where: {
          approveStatus: "Approved",
        }
      }, {
        model: db.m2dModelInputType,
        required: false
      }, {
        model: db.m2dModelResultType,
        required: false
      }, {
        model: db.m2dModelStar,
        required: false,
        attributes: ["id", "userId"]
      }
    ],
    // group: ['m2dmodel.Id']
  });
};

/**
 * 
 * @param {Number} mid 
 * @returns model card content of the model
 */
exports.getModelCard = (mid) => {
  const modelCardPath = `/m2d/model_cards/${mid}/${mid}.md`
  return readFile(modelCardPath)
}

/**
 *
 * @returns all pending models
 */
exports.findAllPending = () => {
  return db.m2dModel.findAll({
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
      {
        model: db.m2dModelInputType,
        required: false
      },
      {
        model: db.m2dModelResultType,
        required: false
      },
    ],
    attributes: ["id", "name", "version", "details", "approveStatus"],
    order: [["id", "DESC"]],
  });
};

/**
 *
 * @param {String} name
 * @returns all models with the given name
 */
exports.findAllByName = (name) => {
  return db.m2dModel.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
    attributes: ["id", "name", "details"],
  });
};

/**
 *
 * @param {Number} id
 * @returns a model with the given id
 */
exports.findById = (id) => {
  return db.m2dModel.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.user,
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
      {
        model: db.m2dModelReject,
        attributes: ["id", "m2dModelId", "rejectReason", "time"],
        required: false,
      },
      {
        model: db.m2dProject,
        attributes: ["id", "title", "description"],
      },
      {
        model: db.m2dModelInputType,
        required: false
      },
      {
        model: db.m2dModelResultType,
        required: false
      },
      {
        model: db.m2dModelStar,
        required: false
      }
    ],
  });
};

/**
 *
 * @param {Number} uid
 * @returns all models that belongs to the given user
 */
exports.findAllModelNamesAndIdsByUserId = (uid) => {
  return db.m2dModel.findAll({
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
 * @returns all pending models of the given user
 */
exports.findUnapprovedModelsByUserId = (uid) => {
  return db.user.findAll({
    where: {
      id: uid,
    },
    include: [
      {
        model: db.m2dModel,
        where: {
          approveStatus: { [Op.not]: "Approved" },
        },
        include: [
          {
            model: db.m2dProject,
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
          {
            model: db.m2dModelInputType,
            required: false
          },
          {
            model: db.m2dModelResultType,
            required: false
          },
        ],
      },
    ],
  });
};

/**
 * Find all models belonging to a given user
 * @param {Number} uid 
 * @returns {List<Object>} models belong to a given user
 */
exports.findByUserId = (uid) => {
  return db.m2dModel.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id"],
        where: {
          id: uid
        }
      },
      {
        model: db.m2dProject,
        attributes: ["id", "name", "title"],
        required: false,
      },
      {
        model: db.m2dModelStar,
        attributes: ["id"]
      },
      {
        model: db.m2dResult,
        attributes: ["id", "fileName"],
        include: [
          {
            model: db.user,
          },
          {
            model: db.m2dMetrics,
            required: true,
          }
        ]
      }
    ]
  })
}

/**
 * 
 * @param {Number} mid 
 * @returns all users of the given model
 */
exports.findModelUsersByModelId = (mid) => {
  return db.m2dModelUser.findAll({
    where: {
      m2dModelId: mid,
    },
  });
};

/**
 *
 * @param {String} name
 * @param {String} version
 * @param {String} details
 * @param {String} dataDescription
 * @returns created model
 */
exports.create = (
  name,
  version,
  details,
  dataDescription,
  modelInputType,
  modelResultType
) => {
  return db.m2dModel.create({
    name: name,
    version: version,
    details: details,
    dataDescription: dataDescription,
    m2dModelInputTypeId: modelInputType,
    m2dModelResultTypeId: modelResultType,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

/**
 * 
 * @returns all model input types
 */
exports.findAllModelInputTypes = () => {
  return db.m2dModelInputType.findAll();
}

exports.findAllModelResultTypes = () => {
  return db.m2dModelResultType.findAll();
}

/**
 *
 * @param {Number} mid
 * @param {String} name
 * @param {String} version
 * @param {String} details
 * @param {String} dataDescription
 * @param {String} exampleFile
 * @param {Boolean} needApprove
 * @returns updated model
 */
exports.update = (
  mid,
  name,
  m2dModelInputTypeId,
  m2dModelResultTypeId,
  version,
  details,
  dataDescription,
  exampleFile,
  needApprove
) => {
  const updateBody = {
    name: name,
    m2dModelInputTypeId,
    m2dModelResultTypeId,
    version: version,
    details: details,
    dataDescription: dataDescription,
    exampleFile: exampleFile,
    updatedAt: new Date()
  };

  if (needApprove) {
    updateBody.approveStatus = "Under review";
  }

  return db.m2dModel.update(
    updateBody,
    {
      where: {
        id: mid,
      },
    }
  );
};

/**
 * 
 * @param {Number} mid 
 * @returns removes a given model
 */
exports.remove = (mid) => {
  return db.m2dModel.destroy({
    where: {
      id: mid,
    },
  });
};

/**
 * 
 * @param {Number} uid 
 * @param {Number} mid 
 * @returns remove a user from a model
 */
exports.removeUserFromModel = (uid, mid) => {
  return db.m2dModelUser.destroy({
    where: {
      UserId: uid,
      m2dModelId: mid,
    },
  });
};

/**
 *
 * @param {Number} id
 * @returns change the model's status to approved
 */
exports.approve = (id) => {
  return db.m2dModel.update(
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
 * @param {Number} id
 * @param {String} rejectReason
 * @param {Number} adminId
 */
exports.reject = async (mid, rejectReason, adminId) => {
  await db.m2dModel.update(
    {
      approveStatus: "Rejected",
    },
    {
      where: {
        id: mid,
      },
    }
  );

  await db.m2dModelReject.create({
    m2dModelId: mid,
    rejectReason: rejectReason,
    time: new Date(),
    adminId: adminId
  });
};

/**
 * 
 * @param {Array<String>} attributes 
 * @param {Array<Number>} exMids 
 * @param {String} statusFilter 
 * @param {String} searchString 
 * @param {Number} limit 
 * @returns 
 */
exports.search = (attributes = [], exMids = [], statusFilter = "", searchString, limit) => {
  const query = {
    order: [["id", "DESC"]],
  };
  const opAnd = [];

  if (attributes.length > 0) {
    if (attributes.includes("id")) {
      query["attributes"] = attributes;
    } else {
      query["attributes"] = ["id", ...attributes];
    }
  }

  if (exMids.length > 0) {
    opAnd.push({
      id: { [Op.notIn]: exMids },
    });
  }

  if (searchString !== "") {
    opAnd.push({
      [Op.or]: [
        { name: { [Op.like]: `%${searchString}%` } },
        { details: { [Op.like]: `%${searchString}%` } },
      ],
    });

    if (opAnd.length > 0) {
      query["where"] = {
        [Op.and]: opAnd,
      };
    }

    if (statusFilter !== "") {
      query["where"]["approveStatus"] = statusFilter;
    }

    if (limit) {
      query["limit"] = limit;
    }
    return db.m2dModel.findAll(query);
  }
}
