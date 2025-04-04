"use strict";

const CRCWebResourceModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcWebResource",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      content: {
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

module.exports = CRCWebResourceModel;