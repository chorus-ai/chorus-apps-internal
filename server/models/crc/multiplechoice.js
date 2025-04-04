"use strict";

const CRCMultipleChoiceModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcMultipleChoice",
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
      A: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      B: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      C: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      D: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'A',
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
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

module.exports = CRCMultipleChoiceModel;