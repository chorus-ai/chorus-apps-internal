module.exports = (db) => {
  db.form.hasMany(db.formField);
  db.formField.belongsTo(db.form, {
    foreignKey: "formId",
    targetKey: "id",
  });

  db.formField.hasMany(db.formFieldTrigger, {
    as: "targetField"
  });
  db.formFieldTrigger.belongsTo(db.formField, {
    foreignKey: "formFieldId",
    targetKey: "id",
  });
  
  db.formFieldTrigger.belongsTo(db.formField, {
    as: "targetField",
    foreignKey: "targetFieldId",
    targetKey: "id",
  });
  
  db.formField.belongsToMany(db.formField, {
    as: "triggers",
    through: db.formFieldTrigger,
    foreignKey: "targetFieldId",
    otherKey: "formFieldId",
  });
};