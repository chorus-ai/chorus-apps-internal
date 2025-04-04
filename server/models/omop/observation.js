const omopObservationModel = function (sequelize, DataTypes) {
  return sequelize.define("observation", {
    observation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    observation_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    observation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    observation_datetime: {
      type: DataTypes.DATE
    },
    observation_type_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value_as_number: {
      type: DataTypes.DOUBLE
    },
    value_as_string: {
      type: DataTypes.STRING(2000)
    },
    value_as_concept_id: {
      type: DataTypes.INTEGER
    },
    qualifier_concept_id: {
      type: DataTypes.INTEGER
    },
    unit_concept_id: {
      type: DataTypes.INTEGER
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
    observation_source_value: {
      type: DataTypes.STRING(2000)
    },
    observation_source_concept_id: {
      type: DataTypes.INTEGER
    },
    unit_source_value: {
      type: DataTypes.STRING(50)
    },
    qualifier_source_value: {
      type: DataTypes.STRING(50)
    },
    value_source_value: {
      type: DataTypes.STRING(2000)
    },
    observation_event_id: {
      type: DataTypes.BIGINT
    },
    obs_event_field_concept_id: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'observation',
    timestamps: false,
    freezeTableName: true
  });
};

module.exports = omopObservationModel;
