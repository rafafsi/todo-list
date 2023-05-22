const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/todo-list");
  } catch (error) {
    console.log(error);
  }
};

connectDB();