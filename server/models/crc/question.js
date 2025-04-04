"use strict";

const CRCQuestionModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcQuestion",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false
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

module.exports = CRCQuestionModel;