const omopDeathModel = function (sequelize, DataTypes) {
  return sequelize.define("death", {
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    death_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    death_datetime: {
      type: DataTypes.DATE
    },
    death_type_concept_id: {
      type: DataTypes.INTEGER
    },
    cause_concept_id: {
      type: DataTypes.INTEGER
    },
    cause_source_value: {
      type: DataTypes.STRING(50)
    },
    cause_source_concept_id: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: "death",
    timestamps: false,
    freezeTableName: true
  });
  
};
module.exports = omopDeathModel;
