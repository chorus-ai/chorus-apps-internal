
const omopNoteModel = (sequelize, DataTypes) => {
    return sequelize.define('note', {
      note_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      person_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      note_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      note_datetime: {
        type: DataTypes.DATE
      },
      note_type_concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      note_class_concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      note_title: {
        type: DataTypes.STRING(250)
      },
      note_text: {
        type: DataTypes.TEXT, // Adjusted for VARCHAR(65535)
        allowNull: false
      },
      encoding_concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      language_concept_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      provider_id: {
        type: DataTypes.INTEGER
      },
      visit_occurrence_id: {
        type: DataTypes.INTEGER
      },
      visit_detail_id: {
        type: DataTypes.INTEGER
      },
      note_source_value: {
        type: DataTypes.STRING(50)
      },
      note_event_id: {
        type: DataTypes.BIGINT
      },
      note_event_field_concept_id: {
        type: DataTypes.INTEGER
      }
    }, {
      schema: "omopcdm",
      tableName: 'note',
      timestamps: false,
      freezeTableName: true
    });
  };
  
module.exports = omopNoteModel;