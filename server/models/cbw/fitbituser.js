"use strict";

const CBWFitbitUserModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwFitbitUser",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CBWFitbitUserModel;