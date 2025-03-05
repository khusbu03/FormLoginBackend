const bcrypt = require("bcrypt");

async function validatePassword(password, encryptedPassword) {
  return bcrypt.compare(password, encryptedPassword);
}

async function createPasswordHash(password){
  return bcrypt.hash(password,10);
}

module.exports = {createPasswordHash,validatePassword};
