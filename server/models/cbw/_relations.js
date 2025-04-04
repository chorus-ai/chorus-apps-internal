module.exports = (db) => {
  db.user.belongsToMany(db.cbwPermission, {
    through: db.cbwUserPermission,
  });
  
  db.cbwPermission.belongsToMany(db.user, {
    through: db.cbwUserPermission,
  });
  
  db.user.hasMany(db.cbwAward);
  db.cbwAward.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
  });
  
  // db.user.hasMany(db.cbwUserProgress);
  // db.cbwUserProgress.belongsTo(db.user, {
  //   foreignKey: "userId",
  //   targetKey: "id",
  // });
  
  // db.cbwPhase.hasMany(db.cbwUserProgress);
  // db.cbwUserProgress.belongsTo(db.cbwPhase, {
  //   foreignKey: "cbwPhaseId",
  //   targetKey: "id",
  // });
  
  db.user.belongsToMany(db.cbwPhase, {
    through: db.cbwUserProgress,
  });
  
  db.cbwPhase.belongsToMany(db.user, {
    through: db.cbwUserProgress,
  });
  
  db.user.hasMany(db.cbwUserDiet);
  db.cbwUserDiet.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
  });
  
  db.cbwUserDiet.hasMany(db.cbwDietComment);
  db.cbwDietComment.belongsTo(db.cbwUserDiet, {
    foreignKey: "cbwUserDietId",
    targetKey: "id",
  });
  
  db.user.hasMany(db.cbwFitbitUser);
  db.cbwFitbitUser.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id",
  });
  
  db.cbwPhase.hasMany(db.cbwActivity);
  db.cbwActivity.belongsTo(db.cbwPhase, {
    foreignKey: "cbwPhaseId",
    targetKey: "id",
  });
  
  db.cbwActivity.hasMany(db.cbwActivityContent);
  db.cbwActivityContent.belongsTo(db.cbwActivity, {
    foreignKey: "cbwActivityId",
    targetKey: "id",
  });
  
  db.cbwPhase.hasMany(db.cbwDiet);
  db.cbwDiet.belongsTo(db.cbwPhase, {
    foreignKey: "cbwPhaseId",
    targetKey: "id",
  });
  
  db.cbwDiet.hasMany(db.cbwDietContent);
  db.cbwDietContent.belongsTo(db.cbwDiet, {
    foreignKey: "cbwDietId",
    targetKey: "id",
  });
  
};
