const Tag = require("../../models/tag");
const Task = require("../../models/task");

module.exports = {
  create: async (req, res) => {
    try {
      const { name, color } = await req.body;
      const tag = await Tag.create({ name, color });
      await tag.save();
      let taskById = await Task.findByIdAndUpdate(req.params.id, {
        $push: {
          tags: tag._id,
        },
      });
      res.send(taskById);
    } catch (error) {
      res.send(error.message);
    }
  },
  find: async (req, res) => {
    try {
      const tagFound = await Tag.findById(req.params.id);
      res.send(tagFound);
    } catch (error) {
      res.send(error.message);
    }
  },
  update: async (req, res) => {
    try {
      const data = req.body;
      const tagFound = await Tag.findByIdAndUpdate(req.params.id, {
        $set: {
          name: data.name,
          color: data.color,
        },
      });
      await tagFound.save();
      res.send(tagFound);
    } catch (error) {
      res.send(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const deletedTag = await Tag.findByIdAndDelete(req.params.id);
      await res.send(deletedTag);
    } catch (error) {
      res.send(error.message);
    }
  },
  searchTasks: async (req, res) => {
    const urlParam = req.query.tag;

    const findTagId = async (tagName) => {
      return await Tag.findOne({ name: tagName }).then((tag) => tag._id);
    };

    const populateTask = async (tagId) => {
      return await Task.find(
        { tags: tagId },
        "-_id -description -status -__v -priority"
      ).populate("tags", "-_id -description -status -__v");
    };

    if (urlParam.includes(",")) {
      try {
        const params = urlParam.split(",");

        const ids = await Promise.all(
          params.map((tag) => {
            return findTagId(tag);
          })
        );

        const records = await Task.find({ tags: { $all: ids } });

        res.send(records);
      } catch (error) {
        res.send(error.message);
      }
    } else {
      const result = await findTagId(urlParam).then((id) => populateTask(id));
      res.send(result);
    }
  },
};
