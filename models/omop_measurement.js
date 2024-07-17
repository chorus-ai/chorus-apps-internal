const omopMeasurementModel = function (sequelize, DataTypes) {
  return sequelize.define("measurement", {
    measurement_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true // Assuming "identity" implies auto-increment in your SQL database.
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    measurement_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    measurement_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    measurement_datetime: {
      type: DataTypes.DATE
    },
    measurement_time: {
      type: DataTypes.STRING(10)
    },
    measurement_type_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    operator_concept_id: {
      type: DataTypes.INTEGER
    },
    value_as_number: {
      type: DataTypes.DOUBLE
    },
    value_as_concept_id: {
      type: DataTypes.INTEGER
    },
    unit_concept_id: {
      type: DataTypes.INTEGER
    },
    range_low: {
      type: DataTypes.DOUBLE
    },
    range_high: {
      type: DataTypes.DOUBLE
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
    measurement_source_value: {
      type: DataTypes.TEXT // Adjusted for VARCHAR(65535)
    },
    measurement_source_concept_id: {
      type: DataTypes.INTEGER
    },
    unit_source_value: {
      type: DataTypes.STRING(50)
    },
    unit_source_concept_id: {
      type: DataTypes.INTEGER
    },
    value_source_value: {
      type: DataTypes.TEXT // Adjusted for VARCHAR(65535)
    },
    measurement_event_id: {
      type: DataTypes.BIGINT
    },
    meas_event_field_concept_id: {
      type: DataTypes.INTEGER
    },
    _source_primary_key: {
      type: DataTypes.STRING(255)
    },
    _source_primary_key_source: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'measurement',
    timestamps: false,
    freezeTableName: true
  });
};

module.exports = omopMeasurementModel;
