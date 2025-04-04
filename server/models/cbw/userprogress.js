"use strict";

const CBWUserProgressModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwUserProgress",
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
      cbwPhaseId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CBWUserProgressModel;