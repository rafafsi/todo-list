const express = require("express");
const router = new express.Router();

const Task = require("../db/controllers/task/task");
const Tag = require("../db/controllers/tag/tag");

//task routes
router.post("/task/create", Task.create);
router.post("/task/update/:id", Task.update);
router.get("/task/find/:id", Task.find);
router.delete("/task/delete/:id", Task.delete);
router.get("/task/populate/:id", Task.populateTags);

//tag routes
router.post("/tag/create/:id", Tag.create);
router.get("/tag/find/:id", Tag.find);
router.post("/tag/update/:id", Tag.update);
router.delete("/tag/delete/:id", Tag.delete);

module.exports = router;
