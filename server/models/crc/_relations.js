module.exports = (db) => {
  db.crcModule.hasMany(db.crcSummary);
  db.crcSummary.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  });
  
  db.crcModule.hasMany(db.crcAgenda);
  db.crcAgenda.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  });
  
  db.crcModule.hasMany(db.crcModuleRole);
  db.crcModuleRole.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  })
  
  db.crcAgenda.hasMany(db.crcAgendaContent);
  db.crcAgendaContent.belongsTo(db.crcAgenda, {
    foreignKey: "crcAgendaId",
    targetKey: "id",
  });
  
  db.crcAgenda.belongsToMany(db.crcFormat, {
    through: db.crcAgendaFormat
  });
  
  db.crcFormat.belongsToMany(db.crcAgenda, {
    through: db.crcAgendaFormat
  });
  
  db.crcModule.hasMany(db.crcLecture);
  db.crcLecture.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  });
  
  db.crcModule.hasMany(db.crcContent);
  db.crcContent.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  });
  
  db.crcModule.hasMany(db.crcQuestion);
  db.crcQuestion.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  });
  
  db.crcModule.hasMany(db.crcWebResource);
  db.crcWebResource.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  });
  
  db.crcModule.hasMany(db.crcAssignment);
  db.crcAssignment.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  });
  
  db.crcModule.hasMany(db.crcCompetenciesAndEval);
  db.crcCompetenciesAndEval.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id",
  });
  
  db.crcModule.hasMany(db.crcModuleProgress);
  db.crcModuleProgress.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id"
  });
  
  db.user.hasMany(db.crcModuleProgress);
  db.crcModuleProgress.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id"
  });
  
  db.crcContent.hasOne(db.crcContentPage);
  db.crcContentPage.belongsTo(db.crcContent, {
    foreignKey: "crcContentId",
    targetKey: "id"
  });
  
  db.crcModule.hasMany(db.crcMultipleChoice);
  db.crcMultipleChoice.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id"
  });
  
  db.user.hasMany(db.crcQuizUser);
  db.crcQuizUser.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id"
  });
  
  db.crcModule.hasMany(db.crcQuizUser);
  db.crcQuizUser.belongsTo(db.crcModule, {
    foreignKey: "crcModuleId",
    targetKey: "id"
  });
  
  db.crcAssignment.hasOne(db.crcAssignmentContent);
  db.crcAssignmentContent.belongsTo(db.crcAssignment, {
    foreignKey: "crcAssignmentId",
    targetKey: "id"
  });
  
  db.user.hasMany(db.crcPermission);
  db.crcPermission.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id"
  });

  db.user.hasMany(db.crcLocation);

  db.crcLocation.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
  });

  db.user.hasMany(db.crcUserAssignmentContent);
  db.crcUserAssignmentContent.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
  });

  db.crcAssignmentContent.hasMany(db.crcUserAssignmentContent);
  db.crcUserAssignmentContent.belongsTo(db.crcAssignmentContent, {
    foreignKey: "crcAssignmentContentId",
    targetKey: "id",
  });
  
};
