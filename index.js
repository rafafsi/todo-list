const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const app = express();

//middlewares
app.use(cors()); //takes care of security of our application
app.use(bodyParser.json())

//db connection
require("./db/config/db.config");

//requiring routes
app.use(require('./db/routes'))

app.listen(3000, () => console.log("running on port 3000"));


