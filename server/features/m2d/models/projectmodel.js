const ProjectModelModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dProjectModel",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      m2dProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
      },
      m2dModelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = ProjectModelModel;
