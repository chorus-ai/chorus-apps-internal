const ModelInputTypeModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dModelInputType",
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

module.exports = ModelInputTypeModel;
