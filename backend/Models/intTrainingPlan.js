const mongoose = require('mongoose');

// Define internal training plan Schema
const intTrainingPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  trainerName: {
    type: String,
    required: true
  }
});

const intTrainingPlan = mongoose.model('IntTrainingPlan', intTrainingPlanSchema);
module.exports = intTrainingPlan