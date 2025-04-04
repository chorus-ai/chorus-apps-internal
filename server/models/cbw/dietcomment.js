"use strict";

const CBWDietCommentModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "cbwDietComment",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      cbwUserDietId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = CBWDietCommentModel;