const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true }, // Optional field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
});

module.exports = mongoose.model("User", userSchema);
