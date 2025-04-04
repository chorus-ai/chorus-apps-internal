const CommentModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dComment",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      m2dModelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      m2dProjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      replyTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      visibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
      constraints: false,
    }
  );
};

module.exports = CommentModel;
