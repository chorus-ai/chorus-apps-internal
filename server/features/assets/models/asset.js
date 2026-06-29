"use strict";

const AssetModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "asset",
     {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'File path, URL, or folder path'
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'file, url, or dir'
      },
      ext: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'File extension (e.g., csv, json, dcm)'
      },
      info: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Optional metadata or description'
      }
    },
    {
      timestamps: false,
    }
  );
};

module.exports = AssetModel;