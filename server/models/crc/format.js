"use strict";

const CRCFormatModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcFormat",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CRCFormatModel;