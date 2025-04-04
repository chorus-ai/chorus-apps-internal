module.exports = (db) => {
  db.user.hasMany(db.post);
  db.post.belongsTo(db.user);

  db.feature.hasMany(db.post);
  db.post.belongsTo(db.feature);
}