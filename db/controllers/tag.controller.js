const Tag = require("../models/tag");
const Task = require("../models/task");

const handle = require("../util/handleError");

const TagMethods = {
  create: async (req, res) => {
    const [newTag, newTagError] = await handle(
      Tag.create({ name: req.body.name, color: req.body.color }).then(
        async (tag) => await tag.save()
      )
    );

    if (newTagError) {
      res.status(401).send({
        message: "Invalid data! Please type them properly.",
        error: newTagError.message,
      });
    }

    if (newTag && req.params.taskId) {
      const taskId = req.params.taskId;
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
              $push: {
                tags: newTag._id,
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
            .json({ message: "Tag successfully added to this task!" });
        }
      }
    }
    return res.status(200).send(newTag);
  },
  find: async (req, res) => {
    const tagId = req.params.id;
    const [tagFound, tagFoundError] = await handle(Tag.findById(tagId));

    if (tagFound == null) {
      if (tagId.length !== 24) {
        return res
          .status(400)
          .json({ message: "ID must be 24 characters long." });
      } else if (tagFoundError) {
        return res
          .status(404)
          .json({ message: "Tag not found. Please, provide a vaild id." });
      } else {
        return res
          .status(404)
          .json({ message: "Tag not found. Please, provide a vaild id." });
      }
    }

    return res.status(200).send(tagFound);
  },
  update: async (req, res) => {
    const tagId = req.params.id;
    const [tagFound, tagFoundError] = await handle(Tag.findById(req.params.id));

    if (tagFound == null) {
      if (tagId.length !== 24) {
        return res
          .status(400)
          .json({ message: "ID must be 24 characters long." });
      } else if (tagFoundError) {
        return res
          .status(404)
          .json({ message: "Tag not found. Please, provide a vaild id." });
      } else {
        return res
          .status(404)
          .json({ message: "Tag not found. Please, provide a vaild id." });
      }
    }

    if (tagFound) {
      const [updatedTag, updatedTagError] = await handle(
        Tag.updateOne(
          { _id: tagId },
          {
            $set: {
              name: req.body.name,
              color: req.body.color,
            },
          },
          { returnDocument: "after", runValidators: true, new: true }
        )
      );

      if (updatedTagError) {
        res
          .status(401)
          .send({ message: "Tag wasn't updated! Please try again." });
      }

      if (updatedTag) {
        res.status(200).send({
          message: `Tag '${req.body.name}' was updated!`,
        });
      }
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

    //if there's no param, this query will call for all tasks
    if (!urlParam) {
      const [findAllTasks, findAllTasksError] = await handle(
        Task.find().populate("tags", "-_id -__v")
      );

      if (findAllTasks == null) {
        if (findAllTasksError) {
          return res.status(400).send(findAllTasksError);
        }
        return res
          .status(200)
          .send({ message: "You do not have any task created yet." });
      }

      return res.status(200).send(findAllTasks);
    }
    //if seaching for more than one tag
    else if (urlParam.includes(",")) {
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
        Task.find({ tags: { $all: ids } }).populate(
          "tags",
          "-_id -description -status -__v"
        )
      );

      if (multipleTagsError) {
        res.status(401).send({ message: "Tasks not found." });
      }

      if (multipleTags) {
        if (multipleTags.length === 0) {
          return res
            .status(200)
            .send({ message: "This tag is not attached to any task." });
        }
        return res.status(200).send(multipleTags);
      }

      //if searching for just one tag
    } else {
      const [tagFound, tagFoundError] = await handle(
        Tag.findOne({ name: urlParam })
      );

      if (tagFound == null) {
        if (tagFoundError) {
          return res
            .status(404)
            .json({ message: "Tag not found. Please, provide a vaild id." });
        } else {
          return res
            .status(404)
            .json({ message: "Tag not found. Please, provide a vaild id." });
        }
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
        if (singleTagTasks.length === 0) {
          return res
            .status(200)
            .send({ message: "This tag is not attached to any task." });
        }
        return res.status(200).send(singleTagTasks);
      }
    }
  },
};

module.exports = TagMethods;
