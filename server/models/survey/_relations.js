module.exports = (db) => {
  db.feature.hasMany(db.survey);
  db.survey.belongsTo(db.feature);

  db.survey.belongsToMany(db.user, {
    through: db.surveyUser,
    sourceKey: "id",
    targetKey: "id",
  });
  db.user.belongsToMany(db.survey, {
    through: db.surveyUser,
    sourceKey: "id",
    targetKey: "id",
  });
}