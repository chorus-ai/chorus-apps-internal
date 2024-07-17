
const omopConceptModel = (sequelize, DataTypes) => {
    return sequelize.define('note_nlp', {
      note_nlp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      note_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      section_concept_id: {
        type: DataTypes.INTEGER
      },
      snippet: {
        type: DataTypes.STRING(250)
      },
      offset: {
        type: DataTypes.STRING(50)
      },
      lexical_variant: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      note_nlp_concept_id: {
        type: DataTypes.INTEGER
      },
      note_nlp_source_concept_id: {
        type: DataTypes.INTEGER
      },
      nlp_system: {
        type: DataTypes.STRING(250)
      },
      nlp_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      nlp_datetime: {
        type: DataTypes.DATE
      },
      term_exists: {
        type: DataTypes.CHAR(1)
      },
      term_temporal: {
        type: DataTypes.STRING(50)
      },
      term_modifiers: {
        type: DataTypes.STRING(2000)
      }
    }, {
      schema: "omopcdm",
      tableName: 'note_nlp',
      timestamps: false,
      freezeTableName: true
    });
  };
  
module.exports = omopConceptModel;