const omopDrugExposureModel = function (sequelize, DataTypes) {
  return sequelize.define("drug_exposure", {
    drug_exposure_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true // Assuming "identity" implies auto-increment in your SQL database.
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    drug_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    drug_exposure_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    drug_exposure_start_datetime: {
      type: DataTypes.DATE
    },
    drug_exposure_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    drug_exposure_end_datetime: {
      type: DataTypes.DATE
    },
    verbatim_end_date: {
      type: DataTypes.DATEONLY
    },
    drug_type_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stop_reason: {
      type: DataTypes.STRING(20)
    },
    refills: {
      type: DataTypes.INTEGER
    },
    quantity: {
      type: DataTypes.DOUBLE
    },
    days_supply: {
      type: DataTypes.INTEGER
    },
    sig: {
      type: DataTypes.STRING(50)
    },
    route_concept_id: {
      type: DataTypes.INTEGER
    },
    lot_number: {
      type: DataTypes.STRING(50)
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
    drug_source_value: {
      type: DataTypes.STRING(255)
    },
    drug_source_concept_id: {
      type: DataTypes.INTEGER
    },
    route_source_value: {
      type: DataTypes.STRING(50)
    },
    dose_unit_source_value: {
      type: DataTypes.STRING(50)
    },
    _source_primary_key: {
      type: DataTypes.STRING(255)
    },
    _source_primary_key_source: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'drug_exposure',
    timestamps: false,
    freezeTableName: true
  });
};

module.exports = omopDrugExposureModel;
