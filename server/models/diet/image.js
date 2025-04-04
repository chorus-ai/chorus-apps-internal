const DietImageModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "dietImage",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sourceType: {
        type: DataTypes.STRING,
        allowNull: false, // intake, usermessage
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = DietImageModel;
