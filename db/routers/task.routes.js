const express = require("express");
const router = new express.Router();

const Task = require("../controllers/task.controller");

router.post("/api/task/create", Task.create);
router.get("/api/task/find/:id", Task.find);    
router.post("/api/task/update/:id", Task.update);
router.delete("/api/task/delete/:id", Task.delete);
router.post("/api/task/add-tag/:taskId/:tagName", Task.addTagToATask);
router.delete("/api/task/remove-tag/:taskId/:tagName", Task.removeTagFromATask);

module.exports = router;
