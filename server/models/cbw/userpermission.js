"use strict";

const CBWUserPermissionModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwUserPermission",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cbwPermissionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CBWUserPermissionModel;