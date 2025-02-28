"use strict";

// +FK CadaFile, CadaProject
const CadaEventModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaEvent",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      info: DataTypes.TEXT,
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CadaEventModel;
