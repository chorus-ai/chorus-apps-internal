module.exports = (db) => {
  db.dietIntake.hasMany(db.dietImage, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "intake",
    },
  });
  db.dietImage.belongsTo(db.dietIntake, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "intake",
    },
  });

  db.dietIntake.hasMany(db.dietText, {
    foreignKey: "dietIntakeId",
  });
  db.dietText.belongsTo(db.dietIntake, {
    foreignKey: "dietIntakeId",
  });

  db.dietIntake.hasMany(db.dietNutrition, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "intake",
    },
  });
  db.dietNutrition.belongsTo(db.dietIntake, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "intake",
    },
  });

  db.dietImage.hasMany(db.dietNutrition, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "image",
    },
  });
  db.dietNutrition.belongsTo(db.dietImage, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "image",
    },
  });

  db.dietText.hasMany(db.dietNutrition, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "text",
    },
  });
  db.dietNutrition.belongsTo(db.dietText, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "text",
    },
  });

  db.dietSystemMessage.hasMany(db.dietNutrition, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "message",
    },
  });
  db.dietNutrition.belongsTo(db.dietSystemMessage, {
    foreignKey: "sourceId",
    constraints: false,
    scope: {
      sourceType: "message",
    },
  });

  db.dietConversation.hasMany(db.dietUserMessage, {
    foreignKey: "dietConversationId",
  });
  db.dietUserMessage.belongsTo(db.dietConversation, {
    foreignKey: "dietConversationId",
  });

  db.dietConversation.hasMany(db.dietSystemMessage, {
    foreignKey: "dietConversationId",
  });
  db.dietSystemMessage.belongsTo(db.dietConversation, {
    foreignKey: "dietConversationId",
  });

  db.dietSystemMessage.hasMany(db.dietOption, {
    foreignKey: "dietSystemMessageId",
  });
  db.dietOption.belongsTo(db.dietSystemMessage, {
    foreignKey: "dietSystemMessageId",
  });

  db.dietOption.hasMany(db.dietOptionChoice, {
    foreignKey: "dietOptionId",
  });
  db.dietOptionChoice.belongsTo(db.dietOption, {
    foreignKey: "dietOptionId",
  });
}