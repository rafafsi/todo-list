const mongoose = require("mongoose");
const { Schema } = mongoose;

const tagSchema = {
  name: {
    type: String,
    required: "{PATH} is required!",
  },
  color: {
    type: String,
    required: "{PATH} is required!",
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
};

module.exports = mongoose.model("Tag", tagSchema);
