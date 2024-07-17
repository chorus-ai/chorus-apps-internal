const omopVisitDetailModel = function (sequelize, DataTypes) {
  return sequelize.define("visit_detail", {
    visit_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    visit_detail_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    visit_detail_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    visit_detail_start_datetime: {
      type: DataTypes.DATE
    },
    visit_detail_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    visit_detail_end_datetime: {
      type: DataTypes.DATE
    },
    visit_detail_type_concept_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provider_id: {
      type: DataTypes.INTEGER
    },
    care_site_id: {
      type: DataTypes.INTEGER
    },
    visit_detail_source_value: {
      type: DataTypes.STRING(50)
    },
    visit_detail_source_concept_id: {
      type: DataTypes.INTEGER
    },
    admitted_from_concept_id: {
      type: DataTypes.INTEGER
    },
    admitted_from_source_value: {
      type: DataTypes.STRING(50)
    },
    discharged_to_source_value: {
      type: DataTypes.STRING(50)
    },
    discharged_to_concept_id: {
      type: DataTypes.INTEGER
    },
    preceding_visit_detail_id: {
      type: DataTypes.INTEGER
    },
    parent_visit_detail_id: {
      type: DataTypes.INTEGER
    },
    visit_occurrence_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    _source_primary_key: {
      type: DataTypes.STRING(255)
    },
    _source_primary_key_source: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'visit_detail',
    timestamps: false,
    freezeTableName: true
  });
};

module.exports = omopVisitDetailModel;
