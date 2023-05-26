const express = require("express");
const router = new express.Router();

const User = require("../controllers/user.controller");

router.post("/api/user/signup", User.signup);
router.post("/api/user/login", User.login);

module.exports = router;
