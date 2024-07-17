const omopVisitOccurrenceModel = function (sequelize, DataTypes) {
  return sequelize.define("visit_occurrence", {
    visit_occurrence_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    visit_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    visit_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    visit_start_datetime: {
      type: DataTypes.DATE
    },
    visit_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    visit_end_datetime: {
      type: DataTypes.DATE
    },
    visit_type_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provider_id: {
      type: DataTypes.INTEGER
    },
    care_site_id: {
      type: DataTypes.INTEGER
    },
    visit_source_value: {
      type: DataTypes.STRING(50)
    },
    visit_source_concept_id: {
      type: DataTypes.INTEGER
    },
    admitted_from_concept_id: {
      type: DataTypes.INTEGER
    },
    admitted_from_source_value: {
      type: DataTypes.STRING(255)
    },
    discharged_to_concept_id: {
      type: DataTypes.INTEGER
    },
    discharged_to_source_value: {
      type: DataTypes.STRING(255)
    },
    preceding_visit_occurrence_id: {
      type: DataTypes.INTEGER
    },
    _source_primary_key: {
      type: DataTypes.STRING(255)
    },
    _source_primary_key_source: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'visit_occurrence',
    timestamps: false,
    freezeTableName: true
  });
};

module.exports = omopVisitOccurrenceModel;
