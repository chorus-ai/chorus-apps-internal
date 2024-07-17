"use strict";

// +FK User, Project
const CadaProjectUserModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaProjectUser",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      role: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CadaProjectUserModel;
