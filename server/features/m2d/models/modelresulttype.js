const ModelResultTypeModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dModelResultType",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = ModelResultTypeModel;
