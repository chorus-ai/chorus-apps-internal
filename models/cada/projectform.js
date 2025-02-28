"use strict";

// +FK User, Project
const CadaProjectFormModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaProjectForm",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      cadaProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      formId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CadaProjectFormModel;
