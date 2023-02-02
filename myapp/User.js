const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

userSchema.methods.validPassword = function (pwd) {
  // EXAMPLE CODE!
  return this.password === pwd;
};

var User = mongoose.model("User", userSchema);

module.exports = User;
