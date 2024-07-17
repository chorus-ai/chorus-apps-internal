db = require("../../models");
const { Op } = require("sequelize");

const DEFAULT_PAGE_SIZE = 100;
const DEFAULT_SORT_ORDER = [["id", "ASC"]];

/**
 *
 * @param {String} pid project id
 * @param {Boolean} completed completed annotations only
 * @param {Number} page page
 * @param {Number} pageSize page size
 * @param {Number} sortOrder sort
 * @param {Number} sinceId since event id
 * @returns all events
 */
exports.findAll = (pid, completed, page, pageSize, sortOrder, sinceId) => {
  let offset = page >= 1 ? (page - 1) * pageSize : 0;
  let limit = pageSize > 0 && pageSize <= DEFAULT_PAGE_SIZE ? pageSize : DEFAULT_PAGE_SIZE; 
  let order = sortOrder ? sortOrder : DEFAULT_SORT_ORDER;

  let cadaEventFilter =
    sinceId !== null && typeof sinceId !== "undefined"
      ? { id: { [Op.gt]: sinceId }, cadaProjectId: pid }
      : { cadaProjectId: pid };

  let include = [
    {
      model: db.cadaAdjudicationValue,
      required: false,
    },
    {
      model: db.cadaFile,
    },
  ];

  //include annotation values if specified
  if (completed !== null && typeof completed !== "undefined") {
    include.push({
      model: db.cadaAnnotation,
      where: { completed: completed },
      include: [
        {
          model: db.cadaAnnotationValue,
        },
      ],
    });
  }

  return db.cadaEvent.findAll({
    where: cadaEventFilter,
    include: include,
    offset: offset,
    limit: limit,
    order: order,
  });
};

/**
 *
 * @param {Number} pid project id
 * @param {Array<Number>} files file ids
 * @returns created feature
 */
exports.create = (pid, files) => {
  return db.sequelize_app.transaction(function (t) {
    return db.cadaEvent
      .findAll({
        where: {
          cadaProjectId: pid,
          cadaFileId: { [Op.in]: files },
        },
        attributes: ["cadaFileId"],
        transaction: t,
      })
      .then(function (result) {
        let assignedFiles = result.map(
          (e) => e.get({ plain: true }).cadaFileId
        );
        let promiseArray = [];

        for (let i = 0; i < files.length; i += 1000) {
          let events = [];

          for (let j = i; j < files.length && j < i + 1000; j++) {
            if (
              typeof assignedFiles.find((e) => e === files[j]) === "undefined"
            ) {
              events.push({
                cadaProjectId: pid,
                cadaFileId: files[j],
              });
            }
          }

          if (events.length > 0) {
            promiseArray.push(
              db.cadaEvent.bulkCreate(events, { transaction: t })
            );
          }
        }

        return Promise.all(promiseArray).then(function () {
          return db.cadaEvent
            .findAll({
              where: {
                cadaProjectId: pid,
                cadaFileId: { [Op.in]: files },
              },
              attributes: ["Id", "cadaFileId", "cadaProjectId"],
              transaction: t,
            })
            .then(function (events) {
              let e = [];
              for (let i = 0; i < events.length; i++) {
                e[i] = events[i].get({ plain: true });
              }
              return e;
            });
        });
      });
  });
};

/**
 *
 * @param {Number} pid project id
 * @param {Boolean} completed completed annotation only
 * @returns a feature of the given user
 */
exports.count = (pid, completed) => {
  let annotationFilter =
    completed !== null && typeof completed !== "undefined"
      ? {
          required: true,
          distinct: true,
          include: [
            {
              model: db.cadaAnnotation,
              where: {
                completed: true,
              },
            },
          ],
        }
      : { attributes: [] };

  return db.cadaEvent.count({
    where: {
      cadaProjectId: pid,
    },
    ...annotationFilter,
  });
};

/**
 *
 * @param {Number} eid
 * @returns remove event
 */
exports.delete = (eid) => {
  return db.cadaEvent.destroy({
    where: {
      id: eid,
    },
  });
};

/**
 *
 * @returns assignments for given projectId, userId
 */
exports.findAssignments = ( pid, uid, completed, page, pageSize, sortOrder, sinceId 
) => {
  let offset = page >= 1 ? (page - 1) * pageSize : 0;
  let limit = pageSize > 0 && pageSize <= 1000 ? pageSize : DEFAULT_PAGE_SIZE;
  let order = sortOrder ? sortOrder : DEFAULT_SORT_ORDER;

  let annotationFilter =
    completed !== null && typeof completed !== "undefined"
      ? { userId: uid, completed: completed }
      : { userId: uid };

  if (sinceId === "null" || sinceId === "undefined") {
    sinceId = null;
  }

  let cadaEventFilter =
    (sinceId !== null && typeof sinceId !== "undefined")
      ? { id: { [Op.gt]: sinceId }, cadaProjectId: pid }
      : { cadaProjectId: pid };

      console.log('--- --- ---', cadaEventFilter);
  return db.cadaEvent.findAll({
    where: cadaEventFilter,
    include: [
      {
        model: db.cadaAnnotation,
        where: annotationFilter,
        include: [
          {
            model: db.cadaAnnotationValue,
            required: false,
          },
        ],
      },
      {
        model: db.cadaAdjudicationValue,
      },
      {
        model: db.cadaFile,
      },
    ],
    offset: offset,
    limit: limit,
    order: order,
  });
};

/**
 *
 * @param {Number} uid userId
 * @param {Array<Number>} eIds event ids
 */
exports.createAssignments = (uid, eIds) => {
  return db.sequelize_app.transaction(function (t) {
    return db.cadaAnnotation
      .findAll({
        where: {
          userId: uid,
          cadaEventId: { [Op.in]: eIds },
        },
        attributes: ["cadaEventId"],
        transaction: t,
      })
      .then(function (existingAnnotations) {
        let assignedEvents = existingAnnotations.map(
          (e) => e.get({ plain: true }).cadaEventId
        );
        let promiseArray = [];

        for (let i = 0; i < eIds.length; i += 1000) {
          let records = [];

          for (let j = i; j < eIds.length && j < i + 1000; j++) {
            if (
              typeof assignedEvents.find((e) => e === eIds[j]) === "undefined"
            ) {
              records.push({
                userId: uid,
                completed: false,
                cadaEventId: eIds[j],
              });
            }
          }

          if (records.length > 0) {
            promiseArray.push(
              db.cadaAnnotation.bulkCreate(records, { transaction: t })
            );
          }
        }
        return Promise.all(promiseArray).then(function () {
          return db.cadaEvent
            .findAll({
              where: {
                id: { [Op.in]: eIds },
              },
              include: [
                {
                  model: db.cadaAnnotation,
                  required: true,
                  where: {
                    userId: uid,
                  },
                },
                {
                  model: db.cadaFile,
                },
              ],
              attributes: [],
              transaction: t,
            })
            .then(function (annotations) {
              let e = [];
              for (let i = 0; i < annotations.length; i++) {
                e[i] = annotations[i].get({ plain: true });
              }
              return e;
            });
        });
      });
  });
};

/**
 *
 * @param {Number} uid
 * @param {Array<Number>} annotations
 * @returns remove assignments
 */
exports.deleteAssignments = (uid, annotations) => {
  return db.cadaAnnotation
    .findAll({
      where: {
        userId: uid,
        completed: true,
        id: {
          [Op.in]: annotations,
        },
      },
      attributes: ["id"],
    })
    .then(function (completed) {
      let completedAnnotations = completed.map(
        (e) => e.get({ plain: true }).id
      );
      console.log(completedAnnotations);
      let uncompleteAnnotations = [];

      for (let i = 0; i < annotations.length; i++) {
        if (
          typeof completedAnnotations.find((e) => e === annotations[i]) ===
          "undefined"
        ) {
          uncompleteAnnotations.push(annotations[i]);
        }
      }
      if (uncompleteAnnotations.length > 0) {
        return db.cadaAnnotation
          .destroy({
            where: {
              userId: uid,
              id: {
                [Op.in]: uncompleteAnnotations,
              },
            },
          })
          .then(function (changedRows) {
            return changedRows;
          });
      } else {
        return 0;
      }
    });
};

/**
 *
 * @param {Number} uid userId
 * @param {Number} pid projectId
 */
exports.countAssignments = (pid, uid) => {
  let annotationFilter =
    uid !== null && typeof uid !== "undefined"
      ? {
          include: [
            {
              model: db.cadaAnnotation,
              where: { userId: uid },
            },
          ],
          group: ["cadaAnnotations.completed"],
        }
      : { attributes: [] };

  return db.cadaEvent.count({
    where: {
      cadaProjectId: pid,
    },
    ...annotationFilter,
  });
};

/**
 *
 * @param {Number} annotationId
 * @param {String} createdAt
 * @returns updated Result
 */
exports.updateAnnotationComplete = (annotationId, createdAt) => {
  return db.cadaAnnotation.update(
    {
      completed: true,
      updatedAt: createdAt,
    },
    {
      where: {
        id: annotationId,
      },
    }
  );
};

/**
 *
 * @param {String} field
 * @param {String} value
 * @param {String} cadaAnnotationId
 * @param {String} createdAt
 * @returns created annotationValue
 */
exports.createAnnotationValue = (field, value, cadaAnnotationId, createdAt) => {
  return db.cadaAnnotationValue.create({
    field: field,
    value: value,
    cadaAnnotationId: cadaAnnotationId,
    createdAt: createdAt,
  });
};

/**
 *
 * @param {String} field
 * @param {String} value
 * @param {Number} userId
 * @param {String} cadaAnnotationId
 * @param {String} createdAt
 * @returns created annotationValue
 */
exports.createAdjudicationValue = (
  field,
  value,
  userId,
  cadaEventId,
  createdAt
) => {
  return db.cadaAdjudicationValue.create({
    field: field,
    value: value,
    userId: userId,
    cadaEventId: cadaEventId,
    createdAt: createdAt,
  });
};

/**
 *
 * @param {Array<Number>} eIds event ids
 * @returns a event annotators of the given eventIds
 */
exports.findAnnotators = (eIds) => {
  return db.cadaAnnotation.findAll({
    where: {
      cadaEventId: {
        [Op.in]: eIds,
      },
    },
    attributes: ["userId"],
    group: ["userId"],
  });
};

/**
 *
 * @param {Array<Number>} eIds event ids
 * @returns a event adjudicators of the given eventIds
 */
exports.findAdjudicators = (eIds) => {
  return db.cadaAdjudicationValue.findAll({
    where: {
      cadaEventId: {
        [Op.in]: eIds,
      },
    },
    attributes: ["userId"],
    group: ["userId"],
  });
};
