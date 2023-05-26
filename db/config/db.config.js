const db = require("../models");

db.mongoose
  .connect("mongodb://localhost:27017/todo-list")
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((error) => {
    console.error("Connection error:", error);
    process.exit();
  });