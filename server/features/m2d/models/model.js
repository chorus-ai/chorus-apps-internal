const ModelModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "m2dModel",
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
      m2dModelInputTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      m2dModelResultTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // intendedUse: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // factors: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // trainingData: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // evalData: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // ethicalConsid: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // caveatsRecs: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // license: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      dataDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      exampleFile: {
        type: DataTypes.STRING,
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

module.exports = ModelModel;
