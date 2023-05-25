const express = require("express");
const router = new express.Router();

const Tag = require("../controllers/tag.controller");

router.post("/api/tag/create/:taskId?", Tag.create);
router.get("/api/tag/find/:id", Tag.find);
router.post("/api/tag/update/:id", Tag.update);
router.delete("/api/tag/delete/:id", Tag.delete);
router.get("/api/tag/search-tasks", Tag.searchTasks);

module.exports = router;
