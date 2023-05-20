const Task = require("../../models/task");

module.exports = {
  create: async (req, res) => {
    const { title, status, priority, description } = req.body;
    const task = await Task.create({ title, status, priority, description });
    res.send(task);
  },
  find: async (req, res) => {
    const taskFound = await Task.findById(req.params.id);
    res.send(taskFound);
  },
  update: async (req, res) => {
    const data = req.body;
    let task = await Task.findByIdAndUpdate(req.params.id, {
      $set: {
        title: data.title,
        status: data.status,
        priority: data.priority,
        description: data.description,
      },
    });
    task.save();
    res.send(task);
  },
  delete: async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.send(deletedTask);
  },
  populateTags: async (req, res) => {
    const taskFound = await Task.findById(req.params.id).populate(
      "tags",
      "-_id -__v"
    );
    res.send(taskFound);
  },
};
