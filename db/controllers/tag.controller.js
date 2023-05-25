const Tag = require("../models/tag");
const Task = require("../models/task");

const handle = require("../util/handleError");

module.exports = {
  create: async (req, res) => {
    const [newTag, newTagError] = await handle(
      Tag.create({ name: req.body.name, color: req.body.color }).then(
        async (tag) => await tag.save()
      )
    );

    if (newTagError) {
      res
        .status(401)
        .send({ message: "Invalid data! Please type them properly." });
    }

    const [taskFound, taskFoundError] = await handle(
      Task.findById(req.params.id)
    );

    if (taskFoundError) {
      res
        .status(401)
        .send({ message: "Task not found. Please, provide a vaild id." });
    }

    const [updatedTask, updatedTaskError] = await handle(
      Task.findByIdAndUpdate(req.params.id, {
        $push: {
          tags: newTag._id,
        },
      })
    );

    if (updatedTaskError) {
      res
        .status(401)
        .send({ message: "Task wasn't updated. Please try again." });
    }

    res.status(200).send(updatedTask);
  },
  find: async (req, res) => {
    const [tagFound, tagFoundError] = await handle(Tag.findById(req.params.id));

    if (tagFoundError) {
      res
        .status(401)
        .send({ message: "Tag not found. Please, provide a vaild id." });
    }

    if (tagFound) {
      res.status(200).send(tagFound);
    }
  },
  update: async (req, res) => {
    const [updatedTag, updatedTagError] = await handle(
      Tag.findByIdAndUpdate(req.params.id, {
        $set: {
          name: req.body.name,
          color: req.body.color,
        },
      })
    );

    if (updatedTagError) {
      res
        .status(401)
        .send({ message: "Tag wasn't updated. Please try again." });
    }

    if (updatedTag) {
      res.status(200).send({
        message: `Tag '${req.body.name}' was updated!`,
      });
    }
  },

  delete: async (req, res) => {
    const [deletedTag, deletedTagError] = await handle(
      Tag.findByIdAndDelete(req.params.id)
    );

    if (deletedTagError) {
      res
        .status(401)
        .send({ message: "Tag wasn't deleted. Please try again." });
    }

    if (deletedTag) {
      res.status(200).send({
        message: `Tag '${deletedTag.name}' was successfully deleted!`,
      });
    }
  },
  searchTasks: async (req, res) => {
    const urlParam = req.query.tag;

    if (urlParam.includes(",")) {
      const params = urlParam.split(",");

      const ids = await Promise.all(
        params.map(async (tag) => {
          const [tagFound, tagFoundError] = await handle(
            Tag.findOne({ name: tag })
          );

          if (tagFoundError) {
            res
              .status(401)
              .send({ message: "Tag not found. Please, provide a vaild id." });
          }

          if (tagFound) {
            return tagFound;
          }
        })
      );

      const [multipleTags, multipleTagsError] = await handle(
        Task.find({ tags: { $all: ids } })
      );

      if (multipleTagsError) {
        res.status(401).send({ message: "Tasks not found." });
      }

      if (multipleTags) {
        res.status(200).send(multipleTags);
      }
    } else {
      const [tagFound, tagFoundError] = await handle(
        Tag.findOne({ name: urlParam })
      );

      if (tagFoundError) {
        res
          .status(401)
          .send({ message: "Tag not found. Please, provide a vaild id." });
      }

      const [singleTagTasks, singleTagTasksError] = await handle(
        Task.find(
          { tags: tagFound },
          "-_id -description -status -__v -priority"
        ).populate("tags", "-_id -description -status -__v")
      );

      if (singleTagTasksError) {
        res.status(401).send({ message: "Tasks not found." });
      }

      if (singleTagTasks) {
        res.status(200).send(singleTagTasks);
      }
    }
  },
};
