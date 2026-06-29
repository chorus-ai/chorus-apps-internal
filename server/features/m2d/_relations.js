module.exports = (db) => {
  db.user.hasMany(db.m2dComment);
  db.m2dComment.belongsTo(db.user, {
    foreignKey: {
      name: "userId",
      allowNull: true,
    },
    targetKey: "id",
    constraints: false,
  });
  
  db.user.hasMany(db.m2dMetrics);
  db.m2dMetrics.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
  });
  
  db.m2dProject.hasMany(db.m2dComment);
  db.m2dComment.belongsTo(db.m2dProject, {
    foreignKey: {
      name: "m2dProjectId",
      allowNull: true,
    },
    targetKey: "id",
    constraints: false,
  });
  
  db.m2dModel.hasMany(db.m2dComment);
  db.m2dComment.belongsTo(db.m2dModel, {
    foreignKey: {
      name: "m2dModelId",
      allowNull: true,
    },
    targetKey: "id",
    constraints: false,
  });
  
  db.m2dModel.belongsToMany(db.m2dProject, {
    through: db.m2dProjectModel,
    sourceKey: "id",
    targetKey: "id",
    onDelete: "CASCADE",
  });
  
  db.m2dProject.belongsToMany(db.m2dModel, {
    through: db.m2dProjectModel,
    sourceKey: "id",
    targetKey: "id",
    onDelete: "CASCADE",
  });
  
  db.m2dProject.belongsToMany(db.user, {
    through: db.m2dProjectUser,
  });
  
  db.user.belongsToMany(db.m2dProject, {
    through: db.m2dProjectUser,
  });
  
  db.m2dModel.belongsToMany(db.user, {
    through: db.m2dModelUser,
  });
  
  db.user.belongsToMany(db.m2dModel, {
    through: db.m2dModelUser,
  });
  
  db.m2dModel.hasMany(db.m2dResult);
  db.m2dResult.belongsTo(db.m2dModel, {
    foreignKey: "m2dModelId",
    targetKey: "id",
  });
  
  db.m2dResult.hasMany(db.m2dJobStatus);
  db.m2dJobStatus.belongsTo(db.m2dResult, {
    foreignKey: "m2dResultId",
    targetKey: "id",
    onDelete: "CASCADE",
  });
  
  db.m2dResult.hasMany(db.m2dMetrics);
  db.m2dMetrics.belongsTo(db.m2dResult, {
    foreignKey: "m2dResultId",
    targetKey: "id",
    onDelete: "CASCADE",
  });
  
  db.user.hasMany(db.m2dResult);
  db.m2dResult.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
  });
  
  db.m2dComment.hasMany(db.m2dComment, {
    foreignKey: {
      name: "replyTo",
      allowNull: true,
    },
    targetKey: "id",
    as: "childComment",
    constraints: false,
  });
  
  db.m2dComment.belongsTo(db.m2dComment, {
    foreignKey: {
      name: "replyTo",
      allowNull: true,
    },
    targetKey: "id",
    as: "parentComment",
    constraints: false,
  });
  
  db.m2dProject.hasMany(db.m2dProjectReject);
  db.m2dProjectReject.belongsTo(db.m2dProject, {
    foreignKey: "m2dProjectId",
    targetKey: "id",
  });
  
  db.user.hasMany(db.m2dProjectReject);
  db.m2dProjectReject.belongsTo(db.user, {
    foreignKey: "adminId",
    targetKey: "id",
  });
  
  db.m2dModel.hasMany(db.m2dModelReject);
  db.m2dModelReject.belongsTo(db.m2dModel, {
    foreignKey: "m2dModelId",
    targetKey: "id",
  });
  
  db.user.hasMany(db.m2dModelReject);
  db.m2dModelReject.belongsTo(db.user, {
    foreignKey: "adminId",
    targetKey: "id",
  });
  
  db.user.hasMany(db.notification)
  db.notification.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
  })
  
  db.feature.hasMany(db.notification)
  db.notification.belongsTo(db.feature, {
    foreignKey: "featureId",
    targetKey: "id",
  })
  
  db.m2dModelInputType.hasMany(db.m2dModel)
  db.m2dModel.belongsTo(db.m2dModelInputType, {
    foreignKey: "m2dModelInputTypeId",
    targetKey: "id"
  })
  
  db.m2dModelResultType.hasMany(db.m2dModel)
  db.m2dModel.belongsTo(db.m2dModelResultType, {
    foreignKey: "m2dModelResultTypeId",
    targetKey: "id"
  })
  
  db.m2dModel.hasMany(db.m2dModelStar);
  db.m2dModelStar.belongsTo(db.m2dModel, {
    foreignKey: "m2dModelId",
    targetKey: "id"
  })
  
  db.user.hasMany(db.m2dModelStar);
  db.m2dModelStar.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id"
  })
  
  db.m2dResult.beforeDestroy(async (result, options) => {
    await db.m2dJobStatus.destroy({
      where: {
        m2dResultId: result.Id,
      },
    });
    await db.m2dMetrics.destroy({
      where: {
        m2dResultId: result.Id,
      },
    });
  });
  
  db.m2dComment.beforeDestroy(async (comment, options) => {
    // console.log("Deleting", comment.Id);
    const res = await db.m2dComment.update(
      {
        replyTo: -1,
      },
      {
        where: {
          replyTo: comment.Id,
        },
        as: "childComment",
      }
    );
    // console.log("updated: ", res.dataValues.Id);
  });
  
  db.m2dProject.beforeDestroy(async (project, options) => {
    await db.m2dComment.destroy({
      where: {
        m2dProjectId: project.Id,
      },
    });
  
    await db.m2dProjectUser.destroy({
      where: {
        m2dProjectId: project.Id,
      },
    });
  });
  };
  