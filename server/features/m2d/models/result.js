const ResultModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dResult",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      m2dModelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dataSaved: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = ResultModel;
