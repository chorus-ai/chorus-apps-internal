"use strict";

const CBWUserDietModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwUserDiet",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      photo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false
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

module.exports = CBWUserDietModel;