const omopCohortModel = function (sequelize, DataTypes) {
    return sequelize.define("cohort", {
        cohort_definition_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        subject_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cohort_start_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        cohort_end_date: {
          type: DataTypes.DATE,
          allowNull: false,
        }
    }, {
      tableName: "cohort",
      timestamps: false,
      freezeTableName: true
    });
    
  };
  module.exports = omopCohortModel;
  