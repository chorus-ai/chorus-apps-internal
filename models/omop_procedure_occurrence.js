const omopProcedureOccurrenceModel = function (sequelize, DataTypes) {
  return sequelize.define("procedure_occurrence", {
    procedure_occurrence_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    procedure_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    procedure_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    procedure_datetime: {
      type: DataTypes.DATE
    },
    procedure_end_date: {
      type: DataTypes.DATEONLY
    },
    procedure_end_datetime: {
      type: DataTypes.DATE
    },
    procedure_type_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modifier_concept_id: {
      type: DataTypes.INTEGER
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
    procedure_source_value: {
      type: DataTypes.STRING(50)
    },
    procedure_source_concept_id: {
      type: DataTypes.INTEGER
    },
    modifier_source_value: {
      type: DataTypes.STRING(50)
    },
    _source_primary_key: {
      type: DataTypes.STRING(255)
    },
    _source_primary_key_source: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'procedure_occurrence',
    timestamps: false,
    freezeTableName: true
  });
};

module.exports = omopProcedureOccurrenceModel;
