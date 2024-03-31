// Import Mongoose
const mongoose = require("mongoose");

// Define personalInfo Schema
const personalInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  linkedInProfile: {
    type: String,
    // required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    // required: true,
  },
  collegeName: {
    type: String,
    // required: true,
  },
  program: {
    type: String,
    // required: true,
  },
  stream: {
    type: String,
    // required: true,
  },
});

// Create and export PersonalInfo model
const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);
module.exports = PersonalInfo;
