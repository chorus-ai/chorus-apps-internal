const omopCohortDefinitionModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cohort_definition",
    {
      cohort_definition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      cohort_definition_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cohort_definition_description: {
        type: DataTypes.TEXT, 
        allowNull: true,
      },
      definition_type_concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cohort_definition_syntax: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subject_concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cohort_initiation_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "cohort_definition",
      timestamps: false,
      freezeTableName: true,
    }
  );
};
module.exports = omopCohortDefinitionModel;
