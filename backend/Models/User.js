const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  credId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PersonalInfo",
  },
  fullName: String,
  userType: String,
  isPasswordSet: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
