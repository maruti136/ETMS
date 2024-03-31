const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User collection
    required: true,
  },
  score: {
    type: Map,
    topic: [Number], // Array of two numbers [total marks, scored marks]
    required: true,
    default: {},
  },
});

// Create and export Performance model
const Performance = mongoose.model("Performance", performanceSchema);
module.exports = Performance;
