const ProjectModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dProject",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      goal: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      approveStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Under review",
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = ProjectModel;
