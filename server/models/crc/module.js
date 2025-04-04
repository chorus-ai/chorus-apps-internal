"use strict";

const CRCModuleModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcModule",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CRCModuleModel;
