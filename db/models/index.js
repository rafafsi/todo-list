const mongoose = require("mongoose");

const db = {};

db.mongoose = mongoose;

db.user = require("../models/user");
db.task = require("./task");
db.tag = require("./tag");

module.exports = db;
