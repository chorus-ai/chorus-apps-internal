const JobStatusModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dJobStatus",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      m2dResultId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Queuing",
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = JobStatusModel;
