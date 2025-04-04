const DietOptionChoiceModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "dietOptionChoice",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dietOptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = DietOptionChoiceModel;
