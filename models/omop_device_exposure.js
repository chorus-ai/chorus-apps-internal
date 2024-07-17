
const omopConceptModel = (sequelize, DataTypes) => {
    return sequelize.define('device_exposure', {
      device_exposure_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      person_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      device_concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      device_exposure_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      device_exposure_start_datetime: {
        type: DataTypes.DATE
      },
      device_exposure_end_date: {
        type: DataTypes.DATEONLY
      },
      device_exposure_end_datetime: {
        type: DataTypes.DATE
      },
      device_type_concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unique_device_id: {
        type: DataTypes.STRING(255)
      },
      production_id: {
        type: DataTypes.STRING(255)
      },
      quantity: {
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
      device_source_value: {
        type: DataTypes.STRING(500)
      },
      device_source_concept_id: {
        type: DataTypes.INTEGER
      },
      unit_concept_id: {
        type: DataTypes.INTEGER
      },
      unit_source_value: {
        type: DataTypes.STRING(50)
      },
      unit_source_concept_id: {
        type: DataTypes.INTEGER
      },
      _source_primary_key: {
        type: DataTypes.STRING(255)
      },
      _source_primary_key_source: {
        type: DataTypes.STRING(255)
      }
    }, {
      schema: "omopcdm",
      tableName: 'device_exposure',
      timestamps: false,
      freezeTableName: true
    });
  };
  
module.exports = omopConceptModel;