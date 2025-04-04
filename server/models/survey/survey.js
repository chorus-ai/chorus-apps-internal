"use strict";

const SurveyModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "survey",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      frequency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      availability: {
        type: DataTypes.STRING, // 0: all users, 1: selected users, 2: admins
        allowNull: false,
        defaultValue: 0,
      },
      featureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = SurveyModel;
