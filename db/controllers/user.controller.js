const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

const handle = require('../util/handleError')

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

module.exports = {
  signup: async (req, res) => {
    const [user, userError] = await handle(
      User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 6),
      })
    );

    if(userError) {
      res.status(500).send({message: 'deu ruim'})
    }


  },
};