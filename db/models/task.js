const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["In progress", "Finished"],
    required: true,
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);
