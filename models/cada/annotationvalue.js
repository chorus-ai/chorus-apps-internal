"use strict";

// +FK CadaAnnotation
const CadaAnnotationValueModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaAnnotationValue",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      field: DataTypes.STRING,
      value: DataTypes.TEXT,
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

module.exports = CadaAnnotationValueModel;
