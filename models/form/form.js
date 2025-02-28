const FormModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "form",
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
    },
    {
      timestamps: true,
    }
  );
};

module.exports = FormModel;
