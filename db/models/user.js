const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../config/auth.config");
const salt = 10;

const handle = require("../util/handleError");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "{PATH} is required!"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "{PATH} is required!"],
      minlength: [6, "Minimum password length is 6 characters."],
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    token: {
      type: String
    }
  },
  { timestamps: true }
);

//hashing the user password
userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(salt, function (error, salt) {
      if (error) return next(error);

      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
