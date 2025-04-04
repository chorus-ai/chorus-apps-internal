"use strict";

const CBWPhaseModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwPhase",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      activityTitle: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dietTitle: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CBWPhaseModel;