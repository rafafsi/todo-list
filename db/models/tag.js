const mongoose = require("mongoose");
const { Schema } = mongoose;

const tagSchema = {
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
};

module.exports = Schema.model("Tag", tagSchema);
