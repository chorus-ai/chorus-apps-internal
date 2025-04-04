"use strict";

const CRCQuizUserModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcQuizUser",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      crcModuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

module.exports = CRCQuizUserModel;