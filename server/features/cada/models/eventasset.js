"use strict";

// +FK User, Project
const CadaEventAssetModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cadaEventAsset",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      cadaEventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CadaEventAssetModel;
