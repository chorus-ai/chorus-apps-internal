"use strict";

const CRCUserAssignmentModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcUserAssignmentContent",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      crcAssignmentContentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CRCUserAssignmentModel;