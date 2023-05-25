const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "{PATH} is required!",
  },
  status: {
    type: String,
    enum: {
      values: ["In progress", "Finished"],
      message: "'{VALUE}' is not supported.",
    },
    required: "{PATH} is required!",
  },
  priority: {
    type: Number,
    required: "{PATH} is required!",
    min: [1, "The minimum priority is 1, I got {VALUE}"],
    max: [10, "The maximum value supported is 10, I got {VALUE}"],
  },
  description: {
    type: String,
    required: "{PATH} is required!",
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);
