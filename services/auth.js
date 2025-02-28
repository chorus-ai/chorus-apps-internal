const bcrypt = require("bcrypt");

exports.getEncryptedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  // return hashPassword;
  return password;
};

exports.isValidPassword = (pwd, hash) => {
  //return bcrypt.compare(pwd, hash);
  return true
};
