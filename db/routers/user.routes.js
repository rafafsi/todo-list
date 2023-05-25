const express = require("express");
const router = new express.Router();

const User = require("../controllers/user.controller");
const verifySignUp = require("../middlewares/verifySignUp");

router.post(
  "/api/user/signup",
  [verifySignUp.validateEmail, verifySignUp.checkDuplicateEmail],
  User.signup
);

module.exports = router;