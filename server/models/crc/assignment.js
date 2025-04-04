"use strict";

const CRCAssignmentModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcAssignment",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      assignment: {
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

module.exports = CRCAssignmentModel;