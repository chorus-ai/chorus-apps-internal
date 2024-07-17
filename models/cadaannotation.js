"use strict";

// +FK User, CadaEvent
const CadaAnnotationModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaAnnotation",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CadaAnnotationModel;
