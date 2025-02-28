"use strict";

// +FK user, cadaAnnotation
const CadaAdjudicationValueModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaAdjudicationValue",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      field: DataTypes.STRING,
      value: DataTypes.TEXT,
      annotators: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CadaAdjudicationValueModel;
