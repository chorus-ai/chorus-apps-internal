const ModelRejectModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dModelReject",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      m2dModelId: {
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

module.exports = ModelRejectModel;
