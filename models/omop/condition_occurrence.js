const omopConditionOccurrenceModel = function (sequelize, DataTypes) {
  return sequelize.define("condition_occurrence", {
    condition_occurrence_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    condition_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    condition_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    condition_start_datetime: {
      type: DataTypes.DATE
    },
    condition_end_date: {
      type: DataTypes.DATEONLY
    },
    condition_end_datetime: {
      type: DataTypes.DATE
    },
    condition_type_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    condition_status_concept_id: {
      type: DataTypes.INTEGER
    },
    stop_reason: {
      type: DataTypes.STRING(20)
    },
    provider_id: {
      type: DataTypes.INTEGER
    },
    visit_occurrence_id: {
      type: DataTypes.INTEGER
    },
    visit_detail_id: {
      type: DataTypes.INTEGER
    },
    condition_source_value: {
      type: DataTypes.STRING(50)
    },
    condition_source_concept_id: {
      type: DataTypes.INTEGER
    },
    condition_status_source_value: {
      type: DataTypes.STRING(50)
    }
  }, {
    tableName: "condition_occurrence",
    timestamps: false,
    freezeTableName: true
  });
};

module.exports = omopConditionOccurrenceModel;
