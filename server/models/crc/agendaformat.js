"use strict";

const CRCAgendaFormatModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcAgendaFormat",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      crcAgendaId: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      crcFormatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CRCAgendaFormatModel;