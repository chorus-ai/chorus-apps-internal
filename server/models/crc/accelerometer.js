"use strict";

const CRCAccelerometerModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcAccelerometer",
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
      x: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      y: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      z: {
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

module.exports = CRCAccelerometerModel;