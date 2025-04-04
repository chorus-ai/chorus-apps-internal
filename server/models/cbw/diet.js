"use strict";

const CBWDietModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwDiet",
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      group: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cbwPhaseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CBWDietModel;