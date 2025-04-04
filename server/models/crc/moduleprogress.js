"use strict";

const CRCModuleProgressModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcModuleProgress",
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
      crcModuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      progress: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CRCModuleProgressModel;