const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "{PATH} is required!",
  },
  color: {
    type: String,
    required: "{PATH} is required!",
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
});

module.exports = mongoose.model("Tag", tagSchema);
