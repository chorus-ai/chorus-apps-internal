const DietTextModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "dietText",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dietIntakeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = DietTextModel;
