const DietUserMessageModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "dietUserMessage",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      audio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dietConversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = DietUserMessageModel;
