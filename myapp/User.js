var userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

var User = mongoose.model("User", userSchema);

module.exports = User;
