const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//db connection
require("./db/config/db.config");

//requiring routes
app.use(require("./db/routers/task.routes"));
app.use(require("./db/routers/tag.routes"));
app.use(require("./db/routers/user.routes"));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`App is live at ${PORT}`);
});
