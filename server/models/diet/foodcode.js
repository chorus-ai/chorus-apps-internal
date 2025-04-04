"use strict"

const DietFoodCodeModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "dietFoodCode",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      code: DataTypes.STRING,
      description: DataTypes.STRING,
      detail: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
};

module.exports = DietFoodCodeModel;