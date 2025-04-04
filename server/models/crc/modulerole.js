"use strict";

const CRCModuleRoleModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcModuleRole",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      crcModuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CRCModuleRoleModel;