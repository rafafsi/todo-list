const Tag = require("../../models/tag");
const Task = require("../../models/task");

module.exports = {
  create: async (req, res) => {
    const { name, color } = await req.body;

    const tag = await Tag.create({ name, color }); //tag to be added
    await tag.save();

    let taskById = await Task.findByIdAndUpdate(req.params.id, {
      $push: {
        tags: tag._id,
      },
    });
    res.send(taskById);
  },
  find: async (req, res) => {
    const tagFound = await Tag.findById(req.params.id);
    res.send(tagFound);
  },
  update: async (req, res) => {
    const data = req.body;
    const tagFound = await Tag.findByIdAndUpdate(req.params.id, {
      $set: {
        name: data.name,
        color: data.color,
      },
    });
    await tagFound.save();
    res.send(tagFound);
  },
  delete: async (req, res) => {
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    await res.send(deletedTag);
  },
};
