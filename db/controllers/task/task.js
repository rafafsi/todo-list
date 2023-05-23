const Tag = require("../../models/tag");
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
  addTagToATask: async (req, res) => {
    try {
      const tagId = await Tag.findOne({ name: req.params.tagName }).then(
        (tag) => tag._id
      );

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.taskId,
        {
          $push: {
            tags: tagId._id,
          },
        },
        { returnDocument: "after", runValidators: true, new: true }
      ).populate("tags", "-_id -__v");

      await updatedTask.save();
      res.send(updatedTask);
    } catch (error) {
      res.send(error.message);
    }
  },
  removeTagFromATask: async (req, res) => {
    try {
      const tagId = await Tag.findOne({ name: req.params.tagName }).then(
        (tag) => tag._id
      );
      let taskFound = await Task.findByIdAndUpdate(
        req.params.taskId,
        {
          $pull: { tags: tagId },
        },
        { returnDocument: "after", runValidators: true, new: true }
      );

      res.send(taskFound);
    } catch (error) {
      res.send(error.message);
    }
  },
};
