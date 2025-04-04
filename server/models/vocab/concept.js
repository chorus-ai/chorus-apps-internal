
const vocabConceptModel = (sequelize, DataTypes) => {
    return sequelize.define('concept', {
      concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      concept_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      domain_id: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      vocabulary_id: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      concept_class_id: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      standard_concept: {
        type: DataTypes.CHAR(1)
      },
      concept_code: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      valid_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      valid_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      invalid_reason: {
        type: DataTypes.CHAR(1)
      }
    }, { 
      tableName: 'concept',
      timestamps: false,
      freezeTableName: true
    });
  };
  
module.exports = vocabConceptModel;