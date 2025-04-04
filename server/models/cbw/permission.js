"use strict";

const CBWPermissionModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwPermission",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CBWPermissionModel;