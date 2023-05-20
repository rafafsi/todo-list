const { connection } = require("mongoose");
const Task = require("../../models/task");

module.exports = {
  create: async (req, res) => {
    try {
      const { title, status, priority, description } = req.body;
      const task = await Task.create({ title, status, priority, description });
      task.save();
      res.send(task);
    } catch (error) {
      res.send(error.message);
    }
  },
  find: async (req, res) => {
    try {
      const taskFound = await Task.findById(req.params.id);
      res.send(taskFound);
    } catch (error) {
      res.send(error.message);
    }
  },
  update: async (req, res) => {
    try {
      const data = req.body;
      let task = await Task.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: data.title,
            status: data.status,
            priority: data.priority,
            description: data.description,
          },
        },
        { returnDocument: "after", runValidators: true, new: true }
      );
      task.save();
      res.send(task);
    } catch (error) {
      res.send(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const taskDeleted = await Task.findByIdAndDelete(req.params.id);
      res.send(taskDeleted);
    } catch (error) {
      res.send(error.message);
    }
  },
  populateTags: async (req, res) => {
    try {
      const taskFound = await Task.findById(req.params.id).populate(
        "tags",
        "-_id -__v"
      );
      res.send(taskFound);
    } catch (error) {
      res.send(error.message);
    }
  },
};
