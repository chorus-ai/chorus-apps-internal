"use strict";

const CRCLocationModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcLocation",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      accuracy: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      altitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      altitudeAccuracy: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      heading: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      speed: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CRCLocationModel;