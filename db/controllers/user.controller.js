const db = require("../models");
const User = db.user;

const handle = require("../util/handleError");

module.exports = {
  signup: async (req, res) => {
    const [user, userError] = await handle(User.create(req.body));

    if (userError) {
      if (userError.code == 11000) {
        return res
          .status(400)
          .send({ message: "Email is already registered." });
      } else if (userError.errors.password) {
        return res
          .status(400)
          .send({ message: "Minimum password length is 6 characters." });
      }
    }

    if (user) {
      const [userSaved, userSavedError] = await handle(user.save());

      if (userSavedError) {
        return res
          .status(400)
          .send({ message: "User could not be saved. Please, try again." });
      }

      if (userSaved) {
        return res.status(200).send(userSaved);
      }
    }
  },
  login: async (req, res) => {
    let token = req.cookies;
    res.send({ token });
  },
};
