"use strict";

// +FK User
const CadaBot = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaBot",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      path: DataTypes.STRING,
      info: DataTypes.TEXT,
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CadaBot;
