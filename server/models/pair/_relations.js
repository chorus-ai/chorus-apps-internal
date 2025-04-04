module.exports = (db) => {
  db.user.belongsToMany(db.user, {
    through: db.userPair,
    as: 'user1',
    foreignKey: 'user2Id',
    otherKey: 'user1Id'
  });

  db.user.belongsToMany(db.user, {
    through: db.userPair,
    as: 'user2',
    foreignKey: 'user1Id',
    otherKey: 'user2Id'
  });

  db.userPair.belongsTo(db.user, { as: 'user1', foreignKey: 'user1Id' });
  db.userPair.belongsTo(db.user, { as: 'user2', foreignKey: 'user2Id' });

  db.feature.hasMany(db.userPair);
  db.userPair.belongsTo(db.feature);
}