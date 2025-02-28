"use strict";

const CadaProjectModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaProject",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
      goal: DataTypes.STRING,
      data: DataTypes.STRING,
      info: DataTypes.TEXT,
      attributes: DataTypes.TEXT,
      projectType: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CadaProjectModel;
