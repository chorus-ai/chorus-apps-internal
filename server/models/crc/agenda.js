"use strict";

const CRCAgendaModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcAgenda",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      title: {
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

module.exports = CRCAgendaModel;