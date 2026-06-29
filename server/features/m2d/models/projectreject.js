const ProjectRejectModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dProjectReject",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      m2dProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rejectReason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = ProjectRejectModel;
