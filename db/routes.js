const express = require("express");
const router = new express.Router();

const Task = require("../db/controllers/task/task");
const Tag = require("../db/controllers/tag/tag");

//task routes
router.post("/api/task/create", Task.create);
router.post("/api/task/update/:id", Task.update);
router.get("/api/task/find/:id", Task.find);
router.delete("/api/task/delete/:id", Task.delete);
router.get("/api/task/populate/:id", Task.populateTags);
router.post("/api/task/add-tag/:taskId/:tagName", Task.addTagToATask);
router.delete("/api/task/remove-tag/:taskId/:tagName", Task.removeTagFromATask);

//tag routes
router.post("/api/tag/create/:id", Tag.create);
router.get("/api/tag/find/:id", Tag.find);
router.post("/api/tag/update/:id", Tag.update);
router.delete("/api/tag/delete/:id", Tag.delete);
router.get("/api/tag/search-tasks", Tag.searchTasks);

module.exports = router;
