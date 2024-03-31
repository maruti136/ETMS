const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  credId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PersonalInfo",
  },
  fullName: String,
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
