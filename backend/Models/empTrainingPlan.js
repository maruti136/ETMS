const mongoose = require("mongoose");

const empTrainingPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  trainerName: {
    type: String,
    required: true,
  },
});

const empTrainingPlan = mongoose.model(
  "empTrainingPlan",
  empTrainingPlanSchema
);
module.exports = empTrainingPlan;
