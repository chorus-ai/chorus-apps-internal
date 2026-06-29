module.exports = (db) => {

  db.user.hasMany(db.cadaAnnotation);
  db.cadaAnnotation.belongsTo(db.user);

  db.cadaEvent.hasMany(db.cadaAnnotation);
  db.cadaAnnotation.belongsTo(db.cadaEvent);

  db.cadaAnnotation.hasMany(db.cadaAnnotationValue);
  db.cadaAnnotationValue.belongsTo(db.cadaAnnotation);

  db.user.hasMany(db.cadaAdjudicationValue);
  db.cadaAdjudicationValue.belongsTo(db.user);

  db.cadaEvent.hasMany(db.cadaAdjudicationValue);
  db.cadaAdjudicationValue.belongsTo(db.cadaEvent);

  db.cadaFile.hasMany(db.cadaEvent);
  db.cadaEvent.belongsTo(db.cadaFile);

  db.cadaProject.hasMany(db.cadaEvent);
  db.cadaEvent.belongsTo(db.cadaProject);

  db.cadaProject.hasMany(db.cadaProjectUser);
  db.cadaProjectUser.belongsTo(db.cadaProject);
  db.user.hasMany(db.cadaProjectUser, { onDelete: "cascade", hooks: true });
  db.cadaProjectUser.belongsTo(db.user);

  db.user.hasOne(db.cadaBot, {
    foreignKey: {
      allowNull: false,
    },
  });

  db.cadaProject.belongsToMany(db.form, {
    through: db.cadaProjectForm,
    foreignKey: "cadaProjectId",
    otherKey: "formId",
  });
  db.form.belongsToMany(db.cadaProject, {
    through: db.cadaProjectForm,
    foreignKey: "formId",
    otherKey: "cadaProjectId",
  });

  db.cadaEvent.belongsToMany(db.asset, {
    through: db.cadaEventAsset,
    foreignKey: "cadaEventId",
    otherKey: "assetId",
  });
  db.asset.belongsToMany(db.cadaEvent, {
    through: db.cadaEventAsset,
    foreignKey: "assetId",
    otherKey: "cadaEventId",
  });
};
