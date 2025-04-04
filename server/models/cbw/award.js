"use strict";

const CBWAwardModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwAward",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      award: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CBWAwardModel;