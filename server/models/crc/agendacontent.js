"use strict";

const CRCAgendaContentModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "crcAgendaContent",
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
      crcAgendaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = CRCAgendaContentModel;