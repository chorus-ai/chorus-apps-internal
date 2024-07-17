"use strict";

const CadaFileModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaFile",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      path: DataTypes.STRING,
      type: DataTypes.STRING,
      ext: DataTypes.STRING,
      info: DataTypes.TEXT,
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CadaFileModel;
