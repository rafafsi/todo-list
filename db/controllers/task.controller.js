const Tag = require("../models/tag");
const Task = require("../models/task");

const handle = require("../util/handleError");

const TaskMethods = {
  create: async (req, res) => {
    const { title, status, priority, description } = req.body;
    const [newTask, newTaskError] = await handle(
      Task.create({ title, status, priority, description }).then(
        async (task) => await task.save()
      )
    );

    if (newTaskError) {
      res.status(401).send(newTaskError.message);
    }

    if (newTask) {
      res.status(200).send(newTask);
    }
  },
  find: async (req, res) => {
    const taskId = req.params.id;
    const [taskFound, taskFoundError] = await handle(
      Task.findById(taskId).populate("tags", "-_id -__v")
    );

    if (taskFound == null) {
      if (taskId.length !== 24) {
        return res
          .status(400)
          .json({ message: "ID must be 24 characters long." });
      } else if (taskFoundError) {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      } else {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      }
    }

    return res.status(200).send(taskFound);
  },
  update: async (req, res) => {
    const data = req.body;
    const taskId = req.params.id;

    const [taskFound, taskFoundError] = await handle(
      Task.findById(taskId).populate("tags")
    );

    if (taskFound == null) {
      if (taskId.length !== 24) {
        return res
          .status(400)
          .json({ message: "ID must be 24 characters long." });
      } else if (taskFoundError) {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      } else {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      }
    }

    if (taskFound) {
      const [updatedTask, updatedTaskError] = await handle(
        Task.updateOne(
          { _id: taskId },
          {
            $set: {
              title: data.title,
              status: data.status,
              priority: data.priority,
              description: data.description,
            },
          },
          { returnDocument: "after", runValidators: true }
        )
      );

      if (updatedTaskError) {
        res
          .status(500)
          .send({ message: "Task wasn't updated! Please try again." });
      }

      if (updatedTask) {
        res.status(200).send({ message: `Task '${data.title}' was updated` });
      }
    }
  },
  delete: async (req, res) => {
    const taskId = req.params.id;
    const [taskFound, taskFoundError] = await handle(Task.findById(taskId));

    if (taskFound == null) {
      if (taskId.length !== 24) {
        return res
          .status(400)
          .json({ message: "ID must be 24 characters long." });
      } else if (taskFoundError) {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      } else {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      }
    }

    if (taskFound) {
      [deletedTask, deletedTaskError] = await handle(
        Task.deleteOne({ _id: taskId })
      );

      if (deletedTaskError) {
        res
          .status(500)
          .send({ message: "Task wasn't deleted! Please try again." });
      }

      if (deletedTask) {
        res.status(200).send({ message: `Task was successfully deleted.` });
      }
    }
  },
  addTagToATask: async (req, res) => {
    //checking if is a valid tag name
    const tagName = req.params.tagName;

    const [tagFound, tagFoundError] = await handle(
      Tag.findOne({ name: tagName })
    );

    if (tagFound == null) {
      res.status(404).json({
        message:
          "Tag not found. Please, provide a vaild tag name or create a new one.",
      });
    }

    //check if is a valid task
    const taskId = req.params.taskId;
    const [taskFound, taskFoundError] = await handle(Task.findById(taskId));

    if (taskFound == null) {
      if (taskId.length !== 24) {
        return res
          .status(400)
          .json({ message: "ID must be 24 characters long." });
      } else if (taskFoundError) {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      } else {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      }
    }

    //adding valid tag to a valid task
    if (taskFound && tagFound) {
      const [updatedTask, updatedTaskError] = await handle(
        Task.updateOne(
          { _id: taskId },
          {
            $push: {
              tags: tagFound._id._id,
            },
          },
          { returnDocument: "after", runValidators: true, new: true }
        ).populate("tags", "-_id -__v")
      );

      if (updatedTaskError) {
        return res
          .status(500)
          .send({ message: "Task wasn't updated! Please try again." });
      }

      if (updatedTask) {
        return res
          .status(200)
          .json({ message: "Tag added and Task successfully updated!" });
      }
    }
  },
  removeTagFromATask: async (req, res) => {
    //checking if is a valid tag name
    const tagName = req.params.tagName;

    const [tagFound, tagFoundError] = await handle(
      Tag.findOne({ name: tagName })
    );

    if (tagFound == null) {
      res.status(404).json({
        message:
          "Tag not found. Please, provide a vaild tag name or create a new one.",
      });
    }

    //check if is a valid task
    const taskId = req.params.taskId;
    const [taskFound, taskFoundError] = await handle(Task.findById(taskId));

    if (taskFound == null) {
      if (taskId.length !== 24) {
        return res
          .status(400)
          .json({ message: "ID must be 24 characters long." });
      } else if (taskFoundError) {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      } else {
        return res
          .status(404)
          .json({ message: "Task not found. Please, provide a vaild id." });
      }
    }

    //adding valid tag to a valid task
    if (taskFound && tagFound) {
      const [updatedTask, updatedTaskError] = await handle(
        Task.updateOne(
          { _id: taskId },
          {
            $pull: { tags: tagFound._id },
          },
          { returnDocument: "after", runValidators: true, new: true }
        ).populate("tags", "-_id -__v")
      );

      if (updatedTaskError) {
        res
          .status(500)
          .send({ message: "Task wasn't updated! Please try again." });
      }

      if (updatedTask) {
        res
          .status(200)
          .json({ message: "Tag removed and Task successfully updated!" });
      }
    }
  },
};

module.exports = TaskMethods;
