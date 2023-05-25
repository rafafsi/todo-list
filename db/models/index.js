const mongoose = require("mongoose");

const db = {};

db.mongoose = mongoose;

db.user = require("../models/user");
db.task = require("../models/task");
db.tag = require("../models/tag");

module.exports = db;
